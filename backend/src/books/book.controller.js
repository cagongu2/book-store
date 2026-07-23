const Book = require("./book.model");
const ApiResponse = require("../core/ApiResponse");
const ApiError = require("../core/ApiError");
const asyncHandler = require("../core/asyncHandler");
const BookMapper = require("./book.mapper");

const postABook = asyncHandler(async (req, res) => {
    const newBook = new Book({ ...req.body });
    await newBook.save();
    
    res.status(201).json(
        ApiResponse.success(BookMapper.toResponse(newBook), "Tạo sách thành công")
    );
});

// get all books
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find().sort({ createdAt: -1 });
    
    res.status(200).json(
        ApiResponse.success(BookMapper.toResponseList(books))
    );
});

const getSingleBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
        throw ApiError.notFound("Không tìm thấy sách");
    }
    
    res.status(200).json(
        ApiResponse.success(BookMapper.toResponse(book))
    );
});

// update book data
const UpdateBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedBook) {
        throw ApiError.notFound("Không tìm thấy sách để cập nhật");
    }
    
    res.status(200).json(
        ApiResponse.success(BookMapper.toResponse(updatedBook), "Cập nhật sách thành công")
    );
});

const deleteABook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    
    if (!deletedBook) {
        throw ApiError.notFound("Không tìm thấy sách để xóa");
    }
    
    res.status(200).json(
        ApiResponse.success(BookMapper.toResponse(deletedBook), "Xóa sách thành công")
    );
});

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook
};