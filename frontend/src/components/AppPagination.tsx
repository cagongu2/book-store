import React from "react";
import { Pagination } from "antd";

interface AppPaginationProps {
  total: number;
  current: number;
  pageSize: number;
  align?: "center" | "end" | "start";
  pageSizeOptions?: string[];
  size?: "small" | "middle" | "large";
  showSearch?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  itemsPerPage?: string;
  className?: string;
  onChange: (page: number, pageSize: number) => void;
}

export const AppPagination: React.FC<AppPaginationProps> = ({
  total,
  current,
  pageSize,
  className,
  align,
  pageSizeOptions = ["10", "20", "50"],
  size,
  itemsPerPage = "/ page",
  showSearch,
  showTotal,
  onChange,
}) => {
  const defaultShowTotal = (totalCount: number) => (
    <div className="font-normal leading-[150%] w-full text-black/88 text-sm">
      Total {totalCount} items
    </div>
  );

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      showSizeChanger={{ showSearch }}
      showLessItems
      align={align}
      size={size}
      styles={{
        item: {
          borderRadius: 9999,
          backgroundColor: "transparent",
        },
        root: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        },
      }}
      pageSizeOptions={pageSizeOptions}
      showTotal={showTotal || defaultShowTotal}
      locale={{ items_per_page: itemsPerPage }}
      className={`app-pagination ${className || ""}`}
    />
  );
};
