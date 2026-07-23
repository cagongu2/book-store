import type { AxiosRequestConfig } from "axios";
import { axiosClient } from "./axios-client";
import { ApiResponse } from "./api-response";

export type ApiMethod = "get" | "post" | "put" | "patch" | "delete";

export const callApi = async <T = unknown>(
  url: string,
  payload?: unknown,
  method: ApiMethod = "get",
): Promise<ApiResponse<T>> => {
  const isQueryMethod = method === "get" || method === "delete";
  const config: AxiosRequestConfig = {
    url,
    method,
    ...(isQueryMethod ? { params: payload } : { data: payload }),
  };

  const response = await axiosClient.request<unknown>(config);
  return ApiResponse.from<T>(response.data);
};

export default callApi;
