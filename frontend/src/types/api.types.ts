export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: any;
}

export interface ApiErrorResponse {
    success: boolean;
    error_code: string;
    message: string;
    details?: { error_code: string; message: string }[];
}
