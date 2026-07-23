const express = require('express');
const Order = require('./order.model');
const { createAOrder, getOrderByEmail } = require('./order.controller');
const validateRequest = require('../middleware/validateRequest');
const { createOrderSchema } = require('../validations/order.validation');
const router = express.Router();

router.post("/", validateRequest(createOrderSchema), createAOrder);

router.get("/email/:email", getOrderByEmail);

module.exports = router;