import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import { DEFAULT_DATE_FORMAT } from "@/utils/date";

export type DateRangeValue = [Dayjs | null, Dayjs | null] | null;

export interface AppDateRangePickerProps {
  value?: DateRangeValue;
  onChange?: (dates: DateRangeValue) => void;
  size?: "large" | "middle" | "small";
  className?: string;
  allowClear?: boolean;
}

const DATE_RANGE_PLACEHOLDER: [string, string] = ["Ngày bắt đầu", "Ngày kết thúc"];

export const AppDateRangePicker = ({
  value,
  onChange,
  size = "large",
  className,
  allowClear = true,
}: AppDateRangePickerProps) => (
  <DatePicker.RangePicker
    value={value}
    onChange={onChange}
    size={size}
    className={className}
    format={DEFAULT_DATE_FORMAT}
    placeholder={DATE_RANGE_PLACEHOLDER}
    allowClear={allowClear}
  />
);
