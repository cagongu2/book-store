export interface ApiMetadata {
  page?: number;
  pageSize?: number;
  total?: number;
  [key: string]: unknown
}

export class ApiResponse<T> {
  readonly data: T;
  readonly message?: string;
  readonly metadata?: ApiMetadata;

  constructor(data: T, message?: string, metadata?: ApiMetadata) {
    this.data = data;
    this.message = message;
    this.metadata = metadata;
  }

  static from<T>(payload: unknown): ApiResponse<T> {
    if (isRecord(payload) && "data" in payload) {
      return new ApiResponse(
        payload.data as T,
        readString(payload, "message"),
        readMetadata(payload)
      );
    }
    return new ApiResponse(payload as T);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: Record<string, unknown>, key: string): string | undefined {
  const str = value?.[key];
  return typeof str === "string" ? str : undefined;
}

function readMetadata(value: Record<string, unknown>): ApiMetadata | undefined {
  const metadata = value.meta ?? value.metadata;
  return isRecord(metadata) ? metadata : undefined;
}