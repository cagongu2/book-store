const { ZodError } = require('zod');
const { ErrorCodes } = require('../constants/enums');
const ApiError = require('../core/ApiError');

const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const parsedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsedData.body;
            req.query = parsedData.query;
            req.params = parsedData.params;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Formatting zod error to throw our custom ApiError which the global errorHandler will catch
                const formattedErrors = error.errors.map(err => ({
                    error_code: ErrorCodes.VALIDATION_ERROR,
                    message: err.message
                }));
                
                next(new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Dữ liệu không hợp lệ', formattedErrors));
            } else {
                next(error);
            }
        }
    };
};

module.exports = validateRequest;
