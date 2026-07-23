const Category = require("./category.model");
const Book = require("../books/book.model");
const ApiError = require("../core/ApiError");

const validateBusinessRules = async (data, categoryId = null) => {
    // BR-CATE-01: Tối đa 2 cấp
    if (data.parentId) {
        const parent = await Category.findById(data.parentId);
        if (!parent) {
            throw ApiError.notFound("Không tìm thấy danh mục cha");
        }
        if (parent.parentId) {
            throw ApiError.badRequest("Hệ thống chỉ hỗ trợ danh mục tối đa 2 cấp. Không thể chọn danh mục cấp 2 làm danh mục cha.");
        }
    }

    // BR-CATE-06: Tối đa 5 danh mục nổi bật
    if (data.isFeatured) {
        const query = { isFeatured: true, isDeleted: false };
        if (categoryId) query._id = { $ne: categoryId };
        
        const featuredCount = await Category.countDocuments(query);
        if (featuredCount >= 5) {
            throw ApiError.badRequest("Số lượng danh mục nổi bật đã đạt tối đa (5). Vui lòng gỡ nổi bật danh mục khác trước.");
        }
    }
};

const createCategory = async (categoryData) => {
    await validateBusinessRules(categoryData);

    try {
        const newCategory = new Category(categoryData);
        await newCategory.save();
        return newCategory;
    } catch (error) {
        if (error.code === 11000) {
            throw ApiError.badRequest("Tên danh mục này đã tồn tại trong cùng cấp.");
        }
        throw error;
    }
};

const getCategories = async (adminView = false) => {
    // Nếu là frontend user, chỉ lấy category đang active
    const query = { isDeleted: false };
    if (!adminView) {
        query.isActive = true;
    }

    const categories = await Category.find(query).sort({ priority: -1, createdAt: 1 }).lean();

    // Chuyển đổi thành dạng Cây (Tree)
    const tree = [];
    const childrenMap = {};

    categories.forEach(cat => {
        cat.id = cat._id; // Frontend thường dùng id
        if (cat.parentId) {
            if (!childrenMap[cat.parentId]) {
                childrenMap[cat.parentId] = [];
            }
            childrenMap[cat.parentId].push(cat);
        } else {
            tree.push(cat);
        }
    });

    // Gắn children vào root
    tree.forEach(root => {
        root.children = childrenMap[root._id] || [];
    });

    return tree;
};

const getCategoryById = async (id) => {
    const category = await Category.findOne({ _id: id, isDeleted: false }).lean();
    if (!category) {
        throw ApiError.notFound("Không tìm thấy danh mục");
    }
    return category;
};

const updateCategory = async (id, updateData) => {
    const category = await Category.findOne({ _id: id, isDeleted: false });
    if (!category) {
        throw ApiError.notFound("Không tìm thấy danh mục để cập nhật");
    }

    await validateBusinessRules(updateData, id);

    try {
        const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });
        return updated;
    } catch (error) {
        if (error.code === 11000) {
            throw ApiError.badRequest("Tên danh mục này đã tồn tại trong cùng cấp.");
        }
        throw error;
    }
};

const deleteCategory = async (id) => {
    const category = await Category.findOne({ _id: id, isDeleted: false });
    if (!category) {
        throw ApiError.notFound("Không tìm thấy danh mục để xóa");
    }

    // BR-CATE-05: Không cho xóa danh mục cấp 1 đang có danh mục con
    const hasChildren = await Category.exists({ parentId: id, isDeleted: false });
    if (hasChildren) {
        throw ApiError.badRequest("Không thể xóa danh mục đang có danh mục con bên trong. Vui lòng xóa danh mục con trước.");
    }

    // BR-CATE-04: Không cho xóa danh mục đang có sản phẩm
    const hasBooks = await Book.exists({ category: id, isDeleted: false });
    if (hasBooks) {
        throw ApiError.badRequest("Không thể xóa danh mục đang có sản phẩm. Vui lòng chuyển sản phẩm sang danh mục khác trước.");
    }

    // Thực hiện Soft Delete
    category.isDeleted = true;
    await category.save();

    return category;
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
