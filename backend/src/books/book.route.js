const express = require('express');
const { createBook, getBooks, getBookById, updateBook, deleteBook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const validateRequest = require('../middleware/validateRequest');
const { createBookSchema, updateBookSchema, getBooksSchema } = require('../validations/book.validation');
const router =  express.Router();

// post a book
router.post("/create-book", verifyAdminToken, validateRequest(createBookSchema), createBook)

// get all books with pagination
router.get("/", validateRequest(getBooksSchema), getBooks);

// single book endpoint
router.get("/:id", getBookById);

// update a book endpoint
router.put("/edit/:id", verifyAdminToken, validateRequest(updateBookSchema), updateBook);

// delete a book endpoint
router.delete("/:id", verifyAdminToken, deleteBook)

module.exports = router;