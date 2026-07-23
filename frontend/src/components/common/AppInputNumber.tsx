import { Input } from "antd";
import type { InputProps } from "antd";
import type { ChangeEvent } from "react";

export type AppInputNumberProps = Omit<InputProps, "addonAfter"> & {
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  suffix?: React.ReactNode;
  thousandSeparator?: boolean;
};

function formatThousands(digits: string): string {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function filterDigits(raw: string, allowDecimal: boolean): string {
  if (!allowDecimal) {
    return raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  }

  let value = raw.replace(/[^\d.]/g, "");
  value = value.replace(/(\..*)\./g, "$1");
  value = value.replace(/^(\d*)(\.\d{0,2})?.*$/, "$1$2");

  return value.replace(/^0+(?=\d)/, "");
}

function applyMinMax(
  value: string,
  allowDecimal: boolean,
  min?: number,
  max?: number,
): string {
  if (value === "" || value === ".") return value;

  const num = allowDecimal ? parseFloat(value) : Number(value);
  if (Number.isNaN(num)) return value;
  if (min !== undefined && num < min) return String(min);
  if (max !== undefined && num > max) return String(max);

  return value;
}

export function AppInputNumber({
  allowDecimal = false,
  min,
  max,
  suffix,
  thousandSeparator = false,
  size = "large",
  value,
  onChange,
  ...rest
}: AppInputNumberProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = filterDigits(e.target.value, allowDecimal);
    const nextValue = applyMinMax(filtered, allowDecimal, min, max);

    onChange?.({
      ...e,
      target: { ...e.target, value: nextValue },
    } as ChangeEvent<HTMLInputElement>);
  };

  const displayValue =
    thousandSeparator && !allowDecimal
      ? formatThousands(String(value ?? "").replace(/\D/g, ""))
      : (value ?? "");

  return (
    <Input
      {...rest}
      size={size}
      value={displayValue}
      inputMode={allowDecimal ? "decimal" : "numeric"}
      onChange={handleChange}
      addonAfter={suffix}
    />
  );
}
