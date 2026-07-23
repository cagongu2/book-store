import axios, { type InternalAxiosRequestConfig } from "axios";
import queryString from "query-string";
import { ApiError } from "./api-error";
import getBaseUrl from "../../../utils/baseUrl";

export const axiosClient = axios.create({
  baseURL: getBaseUrl() + "/api/v1",
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.headers.set("Accept", "application/json");
    if (!(config.data instanceof FormData) && !config.headers.has("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }
    const token = localStorage.getItem("customerToken") || localStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle unauthorized (logout)
      localStorage.removeItem("customerToken");
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(ApiError.from(error));
  },
);
