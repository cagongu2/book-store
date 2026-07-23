import { Select, Spin } from "antd";
import type { SelectProps } from "antd";
import { AppButton } from "./AppButton";

export type AppSelectOption = {
  label: React.ReactNode;
  value: string | null;
};

export type AppSelectProps = Omit<SelectProps, "options" | "placeholder"> & {
  options: AppSelectOption[];
  placeholder: string;
  allValue?: string | null;
  lazyLoad?: {
    loading: boolean;
    loadingMore: boolean;
    isError: boolean;
    onPopupScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    onSearch: (value: string) => void;
    retry: () => void;
  };
};

export const AppSelect = ({
  value,
  onChange,
  options,
  placeholder,
  allValue = "all",
  allowClear = true,
  size = "large",
  lazyLoad,
  ...rest
}: AppSelectProps) => {
  const isMultiple = rest.mode === "multiple" || rest.mode === "tags";
  const AllowClear = isMultiple ? allowClear : allowClear && value !== allValue;

  return (
    <Select
      {...rest}
      size={size}
      allowClear={AllowClear}
      placeholder={placeholder}
      value={value}
      options={options}
      labelRender={(option) => {
        if (!isMultiple && option?.value === allValue) {
          return <span>{placeholder}</span>;
        }
        return option?.label;
      }}
      onChange={(next, option) => {
        if (isMultiple) {
          onChange?.(next, option);
        } else {
          onChange?.(next ?? allValue, option);
        }
      }}
      {...(lazyLoad && {
        showSearch: true,
        filterOption: false,
        loading: lazyLoad.loading || lazyLoad.loadingMore,
        onPopupScroll: lazyLoad.onPopupScroll,
        onSearch: lazyLoad.onSearch,
        dropdownRender: (menu) => (
          <>
            {menu}
            {lazyLoad.loadingMore && (
              <div style={{ textAlign: "center", padding: 8 }}>
                <Spin size="small" />
              </div>
            )}
            {lazyLoad.isError && (
              <div style={{ textAlign: "center", padding: 8 }}>
                <AppButton size="small" onClick={lazyLoad.retry}>
                  Tải lại
                </AppButton>
              </div>
            )}
          </>
        ),
      })}
    />
  );
};
