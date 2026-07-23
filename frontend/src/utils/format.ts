import { formatDate, DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from "./date";

export const formatVND = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return `${value.toLocaleString("vi-VN")}đ`;
};

export const formatDateTime = (dateStr: string | null | undefined): string => {
  return formatDate(dateStr, DEFAULT_DATETIME_FORMAT);
};

export const formatOnlyDate = (dateStr: string | null | undefined): string => {
  return formatDate(dateStr, DEFAULT_DATE_FORMAT);
};

export const formatPhone = (text: string | number | null | undefined): string => {
  if (text === null || text === undefined || text === "") return "--";
  const phone = String(text).replace(/\D/g, "");
  if (phone.length === 10) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  }
  return String(text);
};

export const formatRowIndex = (page: number, pageSize: number, index: number): number => {
  return pageSize * (page - 1) + (index + 1);
};

export const getSubValueRange = <T>(
  records: T[] | undefined | null,
  attribute: keyof T
): string => {
  if (!records || records.length === 0) return "-";
  const values = records
    .map((item) => item[attribute] as unknown)
    .filter((val): val is number => typeof val === "number" && !isNaN(val));

  if (values.length === 0) return "-";
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${formatVND(min)}` : `${formatVND(min)} - ${formatVND(max)}`;
};

export const getSubTotal = <T>(
  records: T[] | undefined | null,
  attribute: keyof T
): number => {
  if (!records || records.length === 0) return 0;
  const values = records
    .map((item) => item[attribute] as unknown)
    .filter((val): val is number => typeof val === "number" && !isNaN(val));
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0);
};

export const getSubMaxValue = <T>(
  records: T[] | undefined | null,
  attribute: keyof T
): number => {
  if (!records || records.length === 0) return 0;
  const values = records
    .map((item) => item[attribute] as unknown)
    .filter((val): val is number => typeof val === "number" && !isNaN(val));
  if (values.length === 0) return 0;
  return Math.max(...values);
};

export const cleanObjectParams = <T extends Record<string, any>>(params: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== "")
  ) as Partial<T>;
};

export const formatWeight = (w: number | null | undefined): string => {
  if (w === undefined || w === null) return "-";
  if (w < 1) {
    return `${w * 1000}gr`;
  }
  return `${w}kg`;
};

export const formatDimensions = (
  record: { length?: number | null; width?: number | null; height?: number | null } | undefined | null
): string => {
  if (!record) return "-";
  const { length, width, height } = record;
  if (length === undefined || width === undefined || height === undefined) return "-";
  if (length === null || width === null || height === null) return "-";
  return `${length}cm x ${width}cm x ${height}cm`;
};