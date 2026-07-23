import { useSearchParams } from "react-router-dom";

interface UseUrlPaginationProps {
  defaultPage?: number;
  defaultSize?: number;
}

export const useUrlPagination = ({ defaultPage = 1, defaultSize = 10 }: UseUrlPaginationProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || defaultPage;
  const pageSize = Number(searchParams.get("size")) || defaultSize;

  const setCurrentPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page === 1) {
        next.delete("page");
      } else {
        next.set("page", String(page));
      }
      return next;
    }, { replace: true });
  };

  const setPageSize = (size: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (size === 10) {
        next.delete("size");
      } else {
        next.set("size", String(size));
      }
      // Khi đổi size, thường reset về page 1
      next.delete("page");
      return next;
    }, { replace: true });
  };

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  };
};
