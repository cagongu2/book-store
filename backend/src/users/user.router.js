const express = require('express');
const { loginAdmin } = require('./user.controller');
const validateRequest = require('../middleware/validateRequest');
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

module.exports = router;