const express = require('express');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const validateRequest = require('../middleware/validateRequest');
const { createBookSchema, updateBookSchema } = require('../validations/book.validation');
const router =  express.Router();

// post a book
router.post("/create-book", verifyAdminToken, validateRequest(createBookSchema), postABook)

// get all books
router.get("/", getAllBooks);

// single book endpoint
router.get("/:id", getSingleBook);

// update a book endpoint
router.put("/edit/:id", verifyAdminToken, validateRequest(updateBookSchema), UpdateBook);

// delete a book endpoint
router.delete("/:id", verifyAdminToken, deleteABook)

module.exports = router;