const ApiResponse = require("../core/ApiResponse");
const asyncHandler = require("../core/asyncHandler");
const BookMapper = require("./book.mapper");
const bookService = require("./book.service");

const createBook = asyncHandler(async (req, res) => {
    const newBook = await bookService.createBook(req.body);
    
    res.status(201).json(
        ApiResponse.success(BookMapper.toResponse(newBook), "Tạo sách thành công")
    );
});

// get all books with pagination
const getBooks = asyncHandler(async (req, res) => {
    // page và limit đã được validate bởi validateRequest (zod)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const { books, meta } = await bookService.getBooks(page, limit);
    
    res.status(200).json(
        ApiResponse.success(BookMapper.toResponseList(books), "Lấy danh sách thành công", meta)
    );
});

const getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    
    res.status(200).json(
        ApiResponse.success(BookMapper.toResponse(book))
    );
});

// update book data
const updateBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedBook = await bookService.updateBook(id, req.body);
    
    res.status(200).json(
        ApiResponse.success(BookMapper.toResponse(updatedBook), "Cập nhật sách thành công")
    );
});

const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedBook = await bookService.deleteBook(id);
    
    res.status(200).json(
        ApiResponse.success(BookMapper.toResponse(deletedBook), "Xóa sách thành công")
    );
});

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};