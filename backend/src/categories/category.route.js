const express = require('express');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory, updatePriority } = require('./category.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const validateRequest = require('../middleware/validateRequest');
const { createCategorySchema, updateCategorySchema, getCategoriesSchema, updatePrioritySchema } = require('../validations/category.validation');
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
 *     summary: Lấy danh sách danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục cha. 'null' để lấy category cấp 1.
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         description: Lọc theo cấp (1 hoặc 2).
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: "true = dang active, false = bi an"
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: "Tim kiem theo name, slug, description"
 *       - in: query
 *         name: readyForProduct
 *         schema:
 *           type: boolean
 *         description: "Lọc các danh mục sẵn sàng chứa sản phẩm (không có danh mục con)"
 *       - in: query
 *         name: readyForCategory
 *         schema:
 *           type: boolean
 *         description: "Lọc các danh mục sẵn sàng chứa danh mục con (không có sản phẩm)"
 *       - in: query
 *         name: isTree
 *         schema:
 *           type: boolean
 *           default: true
 *         description: "true = cay, false = danh sach phang"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Số lượng mỗi trang.
 *     responses:
 *       200:
 *         description: Trả về danh sách danh mục
 */
router.get("/", validateRequest(getCategoriesSchema), getCategories);

/**
 * @swagger
 * /api/v1/categories/update-priority:
 *   patch:
 *     summary: Di chuyển / Cập nhật vị trí priority của một danh mục (tự động dồn thứ tự các danh mục còn lại)
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
 *               - categoryId
 *               - priority
 *             properties:
 *               categoryId:
 *                 type: string
 *                 description: ID của danh mục cần chuyển
 *               priority:
 *                 type: integer
 *                 description: Vị trí priority mới mong muốn
 *               parentId:
 *                 type: string
 *                 description: ID danh mục cha mới (nếu muốn đổi cha, optional)
 *     responses:
 *       200:
 *         description: Cập nhật vị trí danh mục thành công
 */
router.patch("/update-priority", verifyAdminToken, validateRequest(updatePrioritySchema), updatePriority);

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
