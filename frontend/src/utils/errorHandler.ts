import { notification } from "antd";
import { ApiError } from "../core/api/api-error";
import { API_ERROR_MESSAGES } from "../core/api/api-error-messages";

export const handleError = (err: unknown) => {
    let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
    let errorDescription: string | undefined = undefined;

    if (err instanceof ApiError) {
        errorMessage = err.message;
        
        // Cố gắng parse chi tiết lỗi (details) nếu có
        if (Array.isArray(err.details) && err.details.length > 0) {
            errorDescription = err.details.map((e: any) => {
                if (e.error_code && API_ERROR_MESSAGES[e.error_code]) {
                    return API_ERROR_MESSAGES[e.error_code];
                }
                return e.message;
            }).filter(Boolean).join(". ");
        }
    } else if (err instanceof Error) {
        errorMessage = err.message;
    }

    notification.error({
        message: "Lỗi",
        description: errorDescription || errorMessage,
        duration: 4.5,
        placement: "topRight",
    });
};
