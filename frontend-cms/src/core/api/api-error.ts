import axios from "axios";

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
      const body: unknown = error.response?.data;
      const bodyRecord = isRecord(body) ? body : undefined;
      const firstError = Array.isArray(bodyRecord?.errors) ? bodyRecord?.errors[0] : undefined;

      const message =
        readString(firstError, "message") ??
        readString(bodyRecord, "message") ??
        error.message;
      return new ApiError(
        message,
        error.response?.status,
        readString(bodyRecord, "code"),
        body
      );
    }
    return new ApiError(error instanceof Error ? error.message : "An unexpected error occurred")
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: Record<string, unknown> | undefined, key: string): string | undefined {
  const str = value?.[key];
  return typeof str === "string" ? str : undefined;
}