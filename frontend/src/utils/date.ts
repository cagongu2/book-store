import type { Dayjs } from "dayjs";

export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";
export const DEFAULT_DATETIME_FORMAT = "DD/MM/YYYY, HH:mm";
export const DEFAULT_TIME_FORMAT = "HH:mm";
export const API_DATE_FORMAT = "YYYY-MM-DD";
export const API_DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
export const MONTH_YEAR_FORMAT = "MM/YYYY";

export const formatDate = (
  dateInput: Date | string | number | null | undefined,
  formatStr: string = DEFAULT_DATE_FORMAT
): string => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return formatStr
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

export const handleRangeDatePickerChange = (
  dates: [Dayjs | null, Dayjs | null] | null,
  onFromChange: (date: Dayjs | null) => void,
  onToChange: (date: Dayjs | null) => void
) => {
  if (dates) {
    onFromChange(dates[0]);
    onToChange(dates[1]);
  } else {
    onFromChange(null);
    onToChange(null);
  }
};
