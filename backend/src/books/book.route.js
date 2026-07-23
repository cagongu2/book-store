const express = require('express');
const { createBook, getBooks, getBookById, updateBook, deleteBook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const validateRequest = require('../middleware/validateRequest');
const { createBookSchema, updateBookSchema, getBooksSchema } = require('../validations/book.validation');
const router =  express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API Quản lý Sách
 */

/**
 * @swagger
 * /api/v1/books/create-book:
 *   post:
 *     summary: Tạo mới một cuốn sách
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - coverImage
 *               - oldPrice
 *               - newPrice
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *               publisher:
 *                 type: string
 *               isbn:
 *                 type: string
 *               pageCount:
 *                 type: integer
 *               language:
 *                 type: string
 *               publishedYear:
 *                 type: integer
 *               category:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               coverImage:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               oldPrice:
 *                 type: number
 *               newPrice:
 *                 type: number
 *               stockQuantity:
 *                 type: integer
 *               stockThreshold:
 *                 type: integer
 *               trending:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [draft, active, inactive]
 *               isDeleted:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tạo sách thành công
 */
router.post("/create-book", verifyAdminToken, validateRequest(createBookSchema), createBook)

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Lấy danh sách toàn bộ sách (có phân trang)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sách mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách sách
 */
router.get("/", validateRequest(getBooksSchema), getBooks);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Lấy chi tiết sách theo ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuốn sách
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết
 */
router.get("/:id", getBookById);

/**
 * @swagger
 * /api/v1/books/edit/{id}:
 *   put:
 *     summary: Cập nhật thông tin sách
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuốn sách
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *               publisher:
 *                 type: string
 *               isbn:
 *                 type: string
 *               pageCount:
 *                 type: integer
 *               language:
 *                 type: string
 *               publishedYear:
 *                 type: integer
 *               category:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               coverImage:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               oldPrice:
 *                 type: number
 *               newPrice:
 *                 type: number
 *               stockQuantity:
 *                 type: integer
 *               stockThreshold:
 *                 type: integer
 *               trending:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [draft, active, inactive]
 *               isDeleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/edit/:id", verifyAdminToken, validateRequest(updateBookSchema), updateBook);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Xóa sách
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuốn sách
 *     responses:
 *       200:
 *         description: Xóa sách thành công
 */
router.delete("/:id", verifyAdminToken, deleteBook)

module.exports = router;