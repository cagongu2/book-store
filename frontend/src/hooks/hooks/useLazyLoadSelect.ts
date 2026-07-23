import { useState, useMemo, useCallback, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useDebounce } from "./useDebounce";
import { ApiError } from "@/core/api/api-error";
import type { ApiResponse } from "@/core/api/api-response";
import type { AppSelectOption } from "@/components/common/AppSelect";

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface UseLazyLoadSelectOptions<T> {
  queryKey: string | string[];
  fetchFn: (params: {
    page: number;
    pageSize: number;
    keyword?: string;
  }) => Promise<ApiResponse<PaginatedResponse<T>>>;

  mapOption: (item: T) => AppSelectOption;
  pageSize?: number;
  debounceDelay?: number;
  enabled?: boolean;
}

export interface UseLazyLoadSelectReturn {
  options: AppSelectOption[];
  loading: boolean;
  loadingMore: boolean;
  hasNextPage: boolean;
  isError: boolean;
  onPopupScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onSearch: (value: string) => void;
  searchValue: string;
  retry: () => void;
}

const SCROLL_THRESHOLD = 0.8;

export const useLazyLoadSelect = <T>({
  queryKey,
  fetchFn,
  mapOption,
  pageSize = 20,
  debounceDelay = 500,
  enabled = true,
}: UseLazyLoadSelectOptions<T>): UseLazyLoadSelectReturn => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, debounceDelay);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [queryKey, debouncedSearch, pageSize],
    queryFn: async ({ pageParam }) => {
      const response = await fetchFn({
        page: pageParam,
        pageSize,
        keyword: debouncedSearch || undefined,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled,
  });

  useEffect(() => {
    if (isError && error) {
      message.error(ApiError.from(error).message || "Tải dữ liệu thất bại");
    }
  }, [isError, error, queryKey]);

  const options = useMemo<AppSelectOption[]>(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items.map(mapOption));
  }, [data, mapOption]);

  const onPopupScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const scrollRatio =
        (target.scrollTop + target.clientHeight) / target.scrollHeight;

      if (scrollRatio >= SCROLL_THRESHOLD && hasNextPage && !isFetchingNextPage && !isError) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isError],
  );

  const onSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const retry = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return {
    options,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    hasNextPage,
    isError,
    onPopupScroll,
    onSearch,
    searchValue,
    retry,
  };
};
