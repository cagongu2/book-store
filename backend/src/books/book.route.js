const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router =  express.Router();

// post a book
router.post("/create-book", postABook)
// , verifyAdminToken
// get all books
router.get("/", getAllBooks);

// single book endpoint
router.get("/:id", getSingleBook);

// update a book endpoint
router.put("/edit/:id", UpdateBook);
// , verifyAdminToken
router.delete("/:id", deleteABook)
// , verifyAdminToken
module.exports = router;