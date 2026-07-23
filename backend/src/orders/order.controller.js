const Order = require("./order.model");
const ApiResponse = require("../core/ApiResponse");
const ApiError = require("../core/ApiError");
const asyncHandler = require("../core/asyncHandler");
const OrderMapper = require("./order.mapper");

const createAOrder = asyncHandler(async (req, res) => {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    
    res.status(201).json(
        ApiResponse.success(OrderMapper.toResponse(savedOrder), "Tạo đơn hàng thành công")
    );
});

const getOrderByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    
    if (!orders || orders.length === 0) {
        throw ApiError.notFound("Không tìm thấy đơn hàng nào");
    }
    
    res.status(200).json(
        ApiResponse.success(OrderMapper.toResponseList(orders))
    );
});

module.exports = {
    createAOrder,
    getOrderByEmail
};