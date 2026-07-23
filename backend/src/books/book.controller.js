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

// get all books with pagination, filters and sorting
const getBooks = asyncHandler(async (req, res) => {
    const { page, limit, category, search, status, trending, sortBy } = req.query;

    const { books, meta } = await bookService.getBooks({
        page,
        limit,
        category,
        search,
        status,
        trending,
        sortBy
    });
    
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