const ApiError = require('../core/ApiError');
const { ErrorCodes } = require('../constants/enums');

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let response = {
        success: false,
        error_code: ErrorCodes.INTERNAL_SERVER,
        message: 'Lỗi hệ thống nội bộ'
    };

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        response.error_code = err.errorCode;
        response.message = err.message;
        if (err.details) response.details = err.details;
    } else if (err.name === 'ValidationError') {
        // Mongoose Validation Error
        statusCode = 400;
        response.error_code = ErrorCodes.VALIDATION_ERROR;
        response.message = 'Dữ liệu không hợp lệ';
        response.details = Object.values(err.errors).map(val => val.message);
    } else if (err.name === 'CastError') {
        // Mongoose Cast Error (e.g. invalid ObjectId)
        statusCode = 400;
        response.error_code = ErrorCodes.VALIDATION_ERROR;
        response.message = 'ID không hợp lệ';
    } else if (err.code === 11000) {
        // Mongoose Duplicate Key Error
        statusCode = 409;
        response.error_code = ErrorCodes.CONFLICT;
        response.message = 'Dữ liệu đã tồn tại';
    } else {
        // Log unexpected errors
        console.error(`[Unhandled Error] ${err.message}`, err);
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
