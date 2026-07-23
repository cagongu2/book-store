const Book = require("./book.model");
const ApiError = require("../core/ApiError");

const createBook = async (bookData) => {
    const newBook = new Book({ ...bookData });
    await newBook.save();
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
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBook) {
        throw ApiError.notFound("Không tìm thấy sách để cập nhật");
    }
    return updatedBook;
};

const deleteBook = async (id) => {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
        throw ApiError.notFound("Không tìm thấy sách để xóa");
    }
    return deletedBook;
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};
