class ApiResponse {
    constructor(success, message, data = null, meta = null) {
        this.success = success;
        this.message = message;
        if (data) this.data = data;
        if (meta) this.meta = meta;
    }

    static success(data, message = 'Success', meta = null) {
        return new ApiResponse(true, message, data, meta);
    }
}

module.exports = ApiResponse;
