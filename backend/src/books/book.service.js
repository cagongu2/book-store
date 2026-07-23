const Book = require("./book.model");
const Category = require("../categories/category.model");
const { recountProductCount } = require("../categories/category.service");
const ApiError = require("../core/ApiError");

const validateCategoryNoChildren = async (categoryIds) => {
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    for (const id of ids) {
        const hasChildren = await Category.exists({ parentId: id, isDeleted: false });
        if (hasChildren) {
            throw ApiError.badRequest("Danh mục này đang có danh mục con, không thể thêm sản phẩm vào.");
        }
    }
};

const recountBookCategories = async (book) => {
    const catIds = (book.categories || []).filter(Boolean);
    const uniqueIds = [...new Set(catIds.map(id => id.toString()))];
    await Promise.all(uniqueIds.map(id => recountProductCount(id)));
};

const createBook = async (bookData) => {
    await validateCategoryNoChildren(bookData.categories || []);
    const newBook = new Book({ ...bookData });
    await newBook.save();
    await recountBookCategories(newBook);
    return newBook;
};

const getBooks = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
        Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Book.countDocuments()
    ]);

    return {
        books,
        meta: {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getBookById = async (id) => {
    const book = await Book.findById(id);
    if (!book) {
        throw ApiError.notFound("Không tìm thấy sách");
    }
    return book;
};

const updateBook = async (id, updateData) => {
    if (updateData.categories && updateData.categories.length > 0) {
        await validateCategoryNoChildren(updateData.categories);
    }

    const oldBook = await Book.findById(id).lean();

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBook) {
        throw ApiError.notFound("Không tìm thấy sách để cập nhật");
    }

    // Recount tất cả category bị ảnh hưởng (cũ + mới)
    const oldCatIds = (oldBook?.categories || []).filter(Boolean);
    const newCatIds = (updatedBook.categories || []).filter(Boolean);
    const allAffected = [...new Set([...oldCatIds, ...newCatIds].map(id => id.toString()))];
    await Promise.all(allAffected.map(id => recountProductCount(id)));

    return updatedBook;
};

const deleteBook = async (id) => {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
        throw ApiError.notFound("Không tìm thấy sách để xóa");
    }
    await recountBookCategories(deletedBook);
    return deletedBook;
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};
