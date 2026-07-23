class ApiError extends Error {
    constructor(statusCode, errorCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        if (details) this.details = details;
        
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, errorCode = 'ERR_BAD_REQUEST', details = null) {
        return new ApiError(400, errorCode, message, details);
    }

    static unauthorized(message = 'Unauthorized', errorCode = 'AUTH_001') {
        return new ApiError(401, errorCode, message);
    }

    static forbidden(message = 'Forbidden', errorCode = 'AUTH_005') {
        return new ApiError(403, errorCode, message);
    }

    static notFound(message = 'Resource not found', errorCode = 'ERR_NOT_FOUND') {
        return new ApiError(404, errorCode, message);
    }

    static conflict(message, errorCode = 'ERR_CONFLICT') {
        return new ApiError(409, errorCode, message);
    }
}

module.exports = ApiError;
