const express = require('express');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('./category.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const validateRequest = require('../middleware/validateRequest');
const { createCategorySchema, updateCategorySchema } = require('../validations/category.validation');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API Quản lý Danh mục Sách
 */

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Tạo mới danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *               priority:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 */
router.post("/", verifyAdminToken, validateRequest(createCategorySchema), createCategory);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Lấy danh sách danh mục (Trả về dạng cây - Tree)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: adminView
 *         schema:
 *           type: boolean
 *         description: Trả về cả các danh mục bị ẩn (isActive = false). Dành cho Admin.
 *     responses:
 *       200:
 *         description: Trả về danh sách danh mục
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về chi tiết danh mục
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *               priority:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", verifyAdminToken, validateRequest(updateCategorySchema), updateCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục (Soft Delete)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete("/:id", verifyAdminToken, deleteCategory);

module.exports = router;
