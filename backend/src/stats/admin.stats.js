const express = require('express');
const { getAdminStats } = require('./stats.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin:
 *   get:
 *     summary: Lấy thống kê Dashboard cho Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về các chỉ số thống kê
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not Admin)
 */
router.get("/", verifyAdminToken, getAdminStats);

module.exports = router;