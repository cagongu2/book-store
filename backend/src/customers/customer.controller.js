const Customer = require('./customer.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiResponse = require("../core/ApiResponse");
const ApiError = require("../core/ApiError");
const asyncHandler = require("../core/asyncHandler");
const CustomerMapper = require("./customer.mapper");
const { ErrorCodes } = require('../constants/enums');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const registerCustomer = asyncHandler(async (req, res) => {
    const { email, password, displayName } = req.body;
    
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
        throw ApiError.conflict("Email đã được sử dụng");
    }

    const newCustomer = new Customer({
        email,
        password,
        displayName: displayName || email.split('@')[0]
    });

    await newCustomer.save();

    const token = jwt.sign(
        { id: newCustomer._id, email: newCustomer.email },
        JWT_SECRET,
        { expiresIn: '30d' } // Customer token valid for 30 days
    );

    res.status(201).json(
        ApiResponse.success({
            token,
            customer: CustomerMapper.toResponse(newCustomer)
        }, "Đăng ký thành công")
    );
});

const loginCustomer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const customer = await Customer.findOne({ email });
    
    if (!customer) {
        throw ApiError.unauthorized("Sai email hoặc mật khẩu", ErrorCodes.INVALID_CREDENTIALS);
    }

    if (customer.isActive === false) {
        throw ApiError.forbidden("Tài khoản đã bị vô hiệu hóa", ErrorCodes.ACCOUNT_DISABLED);
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
        throw ApiError.unauthorized("Sai email hoặc mật khẩu", ErrorCodes.INVALID_CREDENTIALS);
    }
    
    const token = jwt.sign(
        { id: customer._id, email: customer.email },
        JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.status(200).json(
        ApiResponse.success({
            token,
            customer: CustomerMapper.toResponse(customer)
        }, "Đăng nhập thành công")
    );
});

const getProfile = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
        throw ApiError.notFound("Không tìm thấy tài khoản");
    }
    
    res.status(200).json(
        ApiResponse.success({
            customer: CustomerMapper.toResponse(customer)
        })
    );
});

module.exports = {
    registerCustomer,
    loginCustomer,
    getProfile
};
