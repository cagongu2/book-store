import axios from "axios";
import { API_ERROR_MESSAGES } from "./api-error-messages";

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static from(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      const body: any = error.response?.data;
      
      const errorCode = body?.error_code;
      
      const message =
        (errorCode && API_ERROR_MESSAGES[errorCode]) ??
        body?.message ??
        error.message;

      return new ApiError(
        message,
        error.response?.status,
        errorCode,
        body?.details || body
      );
    }
    
    return new ApiError(error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn");
  }
}
