const express = require('express');
const { loginAdmin, getMe } = require('./user.controller');
const validateRequest = require('../middleware/validateRequest');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const { loginAdminSchema } = require('../validations/auth.validation');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/admin:
 *   post:
 *     summary: Admin login
 *     description: Login for admin users using username and password. Supports lockout mechanism after 5 failed attempts.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *       400:
 *         description: Bad request (missing fields)
 *       401:
 *         description: Unauthorized (Invalid credentials)
 *       403:
 *         description: Forbidden (Account disabled)
 *       429:
 *         description: Too many requests (Account locked temporarily)
 *       500:
 *         description: Server error
 */
router.post("/admin", validateRequest(loginAdminSchema), loginAdmin);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/me", verifyAdminToken, getMe);

module.exports = router;