const Category = require("./category.model");
const Book = require("../books/book.model");
const ApiError = require("../core/ApiError");
const { escapeRegex } = require("../utils/stringUtils");

const validateBusinessRules = async (data, categoryId = null) => {
    if (data.parentId) {
        const parent = await Category.findById(data.parentId);
        if (!parent) {
            throw ApiError.notFound("Không tìm thấy danh mục cha");
        }
        if (parent.parentId) {
            throw ApiError.badRequest("Hệ thống chỉ hỗ trợ danh mục tối đa 2 cấp. Không thể chọn danh mục cấp 2 làm danh mục cha.");
        }
    }

    if (data.isFeatured) {
        const query = { isFeatured: true, isDeleted: false };
        if (categoryId) query._id = { $ne: categoryId };

        const featuredCount = await Category.countDocuments(query);
        if (featuredCount >= 5) {
            throw ApiError.badRequest("Số lượng danh mục nổi bật đã đạt tối đa (5). Vui lòng gỡ nổi bật danh mục khác trước.");
        }
    }
};

const recountProductCount = async (categoryId) => {
    const childIds = (await Category.find({ parentId: categoryId, isDeleted: false }).select('_id').lean())
        .map(c => c._id);

    const allIds = [categoryId, ...childIds];

    const count = await Book.countDocuments({
        isDeleted: false,
        status: { $ne: 'inactive' },
        categories: { $in: allIds }
    });

    await Category.findByIdAndUpdate(categoryId, { productCount: count });

    const cat = await Category.findById(categoryId).select('parentId').lean();
    if (cat?.parentId) {
        await recountProductCount(cat.parentId);
    }
};

const createCategory = async (categoryData) => {
    await validateBusinessRules(categoryData);

    const parentId = categoryData.parentId || null;

    if (categoryData.priority === undefined || categoryData.priority === null) {
        const lastCategory = await Category.findOne({ parentId, isDeleted: false })
            .sort({ priority: -1 })
            .select('priority')
            .lean();
        categoryData.priority = lastCategory ? lastCategory.priority + 1 : 1;
    } else {
        const affected = await Category.find({
            parentId,
            isDeleted: false,
            priority: { $gte: categoryData.priority }
        }).sort({ priority: -1 });

        for (const doc of affected) {
            doc.priority = doc.priority + 1;
            await doc.save();
        }
    }

    try {
        const newCategory = new Category(categoryData);
        await newCategory.save();
        return newCategory;
    } catch (error) {
        if (error.code === 11000) {
            throw ApiError.badRequest("Tên danh mục hoặc Priority đã tồn tại trong cùng danh mục cha.");
        }
        throw error;
    }
};

const getCategories = async ({ parentId, level, isActive, searchText, readyForProduct, readyForCategory, isTree = true, page = 1, limit = 20 } = {}) => {
    const query = { isDeleted: false };

    if (isActive !== undefined) {
        query.isActive = isActive;
    }
    if (parentId !== undefined) {
        query.parentId = parentId === 'null' ? null : parentId;
    }
    if (level) {
        query.level = level;
    }
    if (readyForCategory !== undefined) {
        query.productCount = readyForCategory ? 0 : { $gt: 0 };
    }
    if (readyForProduct !== undefined) {
        const categoriesWithChildren = await Category.distinct('parentId', { parentId: { $ne: null }, isDeleted: false });
        if (readyForProduct) {
            query._id = { $nin: categoriesWithChildren };
        } else {
            query._id = { $in: categoriesWithChildren };
        }
    }

    const attachComputed = (cats) => {
        return cats.map(cat => ({
            ...cat,
            id: cat._id,
        }));
    };

    let categories = [];
    let total = 0;

    if (isTree) {
        const rootQuery = { ...query };
        if (rootQuery.parentId === undefined) {
            rootQuery.parentId = null;
        }

        if (searchText && searchText.trim()) {
            const escapedText = escapeRegex(searchText);
            const searchRegex = { $regex: escapedText, $options: "i" };
            const matched = await Category.find({
                ...query,
                $or: [
                    { name: searchRegex },
                    { slug: searchRegex },
                    { description: searchRegex }
                ]
            }).lean();

            const uniqueRootIds = new Set();
            matched.forEach(c => {
                if (c.parentId) uniqueRootIds.add(c.parentId.toString());
                else uniqueRootIds.add(c._id.toString());
            });

            const rootIdsToPaginate = [...uniqueRootIds];
            total = rootIdsToPaginate.length;

            const paginatedRootIds = rootIdsToPaginate.slice((page - 1) * limit, page * limit);
            const roots = await Category.find({ _id: { $in: paginatedRootIds } }).sort({ priority: -1, createdAt: 1 }).lean();
            const childQuery = { parentId: { $in: paginatedRootIds }, isDeleted: false };
            if (isActive !== undefined) childQuery.isActive = isActive;
            const children = await Category.find(childQuery).sort({ priority: -1, createdAt: 1 }).lean();

            categories = [...roots, ...children];
        } else {
            total = await Category.countDocuments(rootQuery);
            const roots = await Category.find(rootQuery).sort({ priority: -1, createdAt: 1 }).skip((page - 1) * limit).limit(limit).lean();
            const childQuery = { parentId: { $in: roots.map(r => r._id) }, isDeleted: false };
            if (isActive !== undefined) childQuery.isActive = isActive;
            const children = await Category.find(childQuery).sort({ priority: -1, createdAt: 1 }).lean();

            categories = [...roots, ...children];
        }

        const enriched = attachComputed(categories);
        const tree = [];
        const childrenMap = {};

        enriched.forEach(cat => {
            if (cat.parentId) {
                if (!childrenMap[cat.parentId]) {
                    childrenMap[cat.parentId] = [];
                }
                childrenMap[cat.parentId].push(cat);
            } else {
                tree.push(cat);
            }
        });

        tree.forEach(root => {
            root.children = childrenMap[root._id] || [];
        });

        return { items: tree, total, page, limit };

    } else {
        if (searchText && searchText.trim()) {
            const escapedText = escapeRegex(searchText);
            const searchRegex = { $regex: escapedText, $options: "i" };
            const matched = await Category.find({
                ...query,
                $or: [
                    { name: searchRegex },
                    { slug: searchRegex },
                    { description: searchRegex }
                ]
            }).lean();

            const parentIds = [...new Set(matched.filter(c => c.parentId).map(c => c.parentId.toString()))];
            const parents = parentIds.length > 0
                ? await Category.find({ _id: { $in: parentIds }, isDeleted: false }).lean()
                : [];
            const allIds = [...new Set([...matched.map(c => c._id.toString()), ...parents.map(c => c._id.toString())])];

            total = await Category.countDocuments({ _id: { $in: allIds } });
            categories = await Category.find({ _id: { $in: allIds } })
                .sort({ priority: -1, createdAt: 1 })
                .skip((page - 1) * limit).limit(limit).lean();
        } else {
            total = await Category.countDocuments(query);
            categories = await Category.find(query)
                .sort({ priority: -1, createdAt: 1 })
                .skip((page - 1) * limit).limit(limit).lean();
        }

        return {
            items: attachComputed(categories),
            total,
            page,
            limit
        };
    }
};

const getCategoryById = async (id) => {
    const category = await Category.findOne({ _id: id, isDeleted: false }).lean();
    if (!category) {
        throw ApiError.notFound("Không tìm thấy danh mục");
    }
    return category;
};

const updateCategory = async (id, updateData) => {
    let category = await Category.findOne({ _id: id, isDeleted: false });
    if (!category) {
        throw ApiError.notFound("Không tìm thấy danh mục để cập nhật");
    }

    await validateBusinessRules(updateData, id);

    // Nếu có thay đổi priority hoặc parentId, xử lý dồn vị trí tự động qua updatePriority
    if (updateData.priority !== undefined || updateData.parentId !== undefined) {
        const targetPriority = updateData.priority !== undefined ? updateData.priority : category.priority;
        category = await updatePriority({
            categoryId: id,
            priority: targetPriority,
            parentId: updateData.parentId
        });
    }

    try {
        Object.keys(updateData).forEach(key => {
            if (key !== 'priority' && key !== 'parentId') {
                category[key] = updateData[key];
            }
        });
        await category.save();

        // Cascade disable: nếu tắt category cha → tắt con + ẩn sản phẩm
        if (updateData.isActive === false) {
            const childIds = (await Category.find({ parentId: id, isDeleted: false }).select('_id').lean())
                .map(c => c._id);

            if (childIds.length > 0) {
                await Category.updateMany(
                    { _id: { $in: childIds } },
                    { isActive: false }
                );
            }

            const allCatIds = [category._id, ...childIds];
            await Book.updateMany(
                {
                    isDeleted: false,
                    status: { $ne: 'inactive' },
                    categories: { $in: allCatIds }
                },
                { status: 'inactive' }
            );

            await recountProductCount(id);
            await Promise.all(childIds.map(cid => recountProductCount(cid)));
        }

        return category;
    } catch (error) {
        if (error.code === 11000) {
            throw ApiError.badRequest("Tên danh mục hoặc Priority đã tồn tại trong cùng danh mục cha.");
        }
        throw error;
    }
};

const deleteCategory = async (id) => {
    const category = await Category.findOne({ _id: id, isDeleted: false });
    if (!category) {
        throw ApiError.notFound("Không tìm thấy danh mục để xóa");
    }

    const hasChildren = await Category.exists({ parentId: id, isDeleted: false });
    if (hasChildren) {
        throw ApiError.badRequest("Không thể xóa danh mục đang có danh mục con bên trong. Vui lòng xóa danh mục con trước.");
    }

    const hasBooks = await Book.exists({
        isDeleted: false,
        categories: id
    });
    if (hasBooks) {
        throw ApiError.badRequest("Không thể xóa danh mục đang có sản phẩm. Vui lòng chuyển sản phẩm sang danh mục khác trước.");
    }
    category.isDeleted = true;
    await category.save();

    return category;
};

const updatePriority = async ({ categoryId, priority: targetPriority, parentId: inputParentId }) => {
    const category = await Category.findOne({ _id: categoryId, isDeleted: false });
    if (!category) {
        throw ApiError.notFound("Không tìm thấy danh mục");
    }

    const oldParentId = category.parentId ? category.parentId.toString() : null;
    let newParentId = oldParentId;

    if (inputParentId !== undefined) {
        newParentId = inputParentId === 'null' || inputParentId === null ? null : inputParentId.toString();
        if (newParentId) {
            const parent = await Category.findOne({ _id: newParentId, isDeleted: false });
            if (!parent) {
                throw ApiError.notFound("Không tìm thấy danh mục cha mới");
            }
            if (parent.parentId) {
                throw ApiError.badRequest("Hệ thống chỉ hỗ trợ danh mục tối đa 2 cấp. Không thể chọn danh mục cấp 2 làm danh mục cha.");
            }
            if (newParentId === categoryId.toString()) {
                throw ApiError.badRequest("Không thể chọn chính danh mục này làm danh mục cha.");
            }
            const hasChildren = await Category.exists({ parentId: categoryId, isDeleted: false });
            if (hasChildren) {
                throw ApiError.badRequest("Danh mục này đang chứa danh mục con, không thể chuyển thành danh mục cấp 2.");
            }
        }
    }

    const oldPriority = category.priority;
    const isSameParent = oldParentId === newParentId;

    if (isSameParent) {
        if (oldPriority === targetPriority) return category;

        // Tạm thời gán priority âm để tránh vi phạm unique index trong lúc dịch chuyển các item khác
        category.priority = -1000000;
        await category.save();

        if (targetPriority > oldPriority) {
            // Kéo từ vị trí cũ lên cao hơn (VD: 1 -> 5): Dồn các vị trí (2..5) lùi xuống -1 (thành 1..4)
            const affected = await Category.find({
                parentId: newParentId,
                isDeleted: false,
                priority: { $gt: oldPriority, $lte: targetPriority }
            }).sort({ priority: 1 });

            for (const doc of affected) {
                doc.priority = doc.priority - 1;
                await doc.save();
            }
        } else {
            // Kéo từ vị trí cũ xuống thấp hơn (VD: 5 -> 1): Dồn các vị trí (1..4) tiến lên +1 (thành 2..5)
            const affected = await Category.find({
                parentId: newParentId,
                isDeleted: false,
                priority: { $gte: targetPriority, $lt: oldPriority }
            }).sort({ priority: -1 });

            for (const doc of affected) {
                doc.priority = doc.priority + 1;
                await doc.save();
            }
        }

        category.priority = targetPriority;
        await category.save();
    } else {
        // Đổi parentId
        // 1. Rút khỏi group cũ: dồn các item trong group cũ có priority > oldPriority lùi -1
        category.priority = -1000000;
        await category.save();

        const oldGroupAffected = await Category.find({
            parentId: oldParentId,
            isDeleted: false,
            priority: { $gt: oldPriority }
        }).sort({ priority: 1 });

        for (const doc of oldGroupAffected) {
            doc.priority = doc.priority - 1;
            await doc.save();
        }

        // 2. Chèn vào group mới: dồn các item trong group mới có priority >= targetPriority tiến +1
        const newGroupAffected = await Category.find({
            parentId: newParentId,
            isDeleted: false,
            priority: { $gte: targetPriority }
        }).sort({ priority: -1 });

        for (const doc of newGroupAffected) {
            doc.priority = doc.priority + 1;
            await doc.save();
        }

        category.parentId = newParentId;
        category.priority = targetPriority;
        category.level = newParentId ? 2 : 1;
        await category.save();

        // Recount lại số lượng sản phẩm cho cả 2 danh mục cha cũ và mới
        if (oldParentId) await recountProductCount(oldParentId);
        if (newParentId) await recountProductCount(newParentId);
    }

    return category;
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    updatePriority,
    recountProductCount
};
