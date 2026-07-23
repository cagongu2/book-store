import { Input } from "antd";
import type { SearchProps } from "antd/es/input";
import { useResponsive } from "@/hooks/useResponsive";

const { Search } = Input;

export type AppSearchProps = Omit<SearchProps, "onChange" | "onSearch"> & {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
};

export const AppSearch = ({
  value,
  onChange,
  onSearch,
  allowClear = true,
  className,
  size = "large",
  ...rest
}: AppSearchProps) => {
  const { isMobile } = useResponsive();

  const handleChange: SearchProps["onChange"] = (e) => {
    const next = e.target.value;
    onChange(next);
    if (next === "") onSearch("");
  };

  return (
    <Search
      size={size}
      allowClear={allowClear}
      value={value}
      onChange={handleChange}
      onSearch={onSearch}
      className={`w-full ${isMobile ? "" : "max-w-[400px]"} ${className ?? ""}`}
      {...rest}
    />
  );
};
