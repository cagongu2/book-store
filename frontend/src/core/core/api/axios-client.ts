import axios, {
  type InternalAxiosRequestConfig,
} from "axios";
import queryString from "query-string";
import { ENV } from "@/constants/env";
import { ApiError } from "./api-error";
import { getAccessToken } from "@/utils/auth-token";
import { ROUTES } from "@/constants/routes";
import { store } from "@/store/store";
import { logOut } from "@/store/slices/auth-slice";

export const axiosClient = axios.create({
  baseURL: ENV.END_POINT,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.headers.set("Accept", "application/json");
    if (!(config.data instanceof FormData) && !config.headers.has("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }
    const token = getAccessToken();
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
      store.dispatch(logOut());

      if (window.location.pathname !== ROUTES.AUTH.LOGIN) {
        window.location.href = ROUTES.AUTH.LOGIN;
      }
    }

    return Promise.reject(ApiError.from(error));
  },
);
