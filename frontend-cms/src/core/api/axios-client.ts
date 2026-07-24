import axios, {
  type InternalAxiosRequestConfig,
} from "axios";
import queryString from "query-string";
import { message } from "antd";
import { ApiError } from "./api-error";
import { ENV } from "../../constants/env";
import { getAccessToken } from "../../utils/auth-token";
import { store } from "../../store/store";
import { logOut, setAuth } from "../../store/slices/auth-slice";
import { ROUTES } from "../../constants/routes";


export const axiosClient = axios.create({
  baseURL: ENV.END_POINT,
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params),
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error: unknown) => {
    const apiError = ApiError.from(error);

    if (axios.isAxiosError(error)) {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const status = error.response?.status;
      const requestUrl = originalRequest?.url || "";

      const isAuthEndpoint =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/refresh") ||
        requestUrl.includes("/auth/logout");

      if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.set("Authorization", `Bearer ${token}`);
                resolve(axiosClient(originalRequest));
              },
              reject: (err: unknown) => {
                reject(err);
              },
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await axios.post(
            `${ENV.END_POINT}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = refreshResponse.data?.data || {};

          if (accessToken) {
            store.dispatch(
              setAuth({
                token: { access: accessToken },
                syncToken: true,
              })
            );

            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
            processQueue(null, accessToken);

            return axiosClient(originalRequest);
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          store.dispatch(logOut());
          message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");

          if (window.location.pathname !== ROUTES.AUTH.LOGIN) {
            window.location.href = ROUTES.AUTH.LOGIN;
          }
          return Promise.reject(ApiError.from(refreshErr));
        } finally {
          isRefreshing = false;
        }
      }

      switch (status) {
        case 401:
          if (isAuthEndpoint && !requestUrl.includes("/auth/login")) {
            store.dispatch(logOut());
            message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
            if (window.location.pathname !== ROUTES.AUTH.LOGIN) {
              window.location.href = ROUTES.AUTH.LOGIN;
            }
          }
          break;
        case 403:
          message.error("Bạn không có quyền thực hiện thao tác này.");
          break;
        case 404:
          message.error("Không tìm thấy dữ liệu yêu cầu.");
          break;
        case 422:
          message.error(apiError.message || "Dữ liệu không hợp lệ.");
          break;
        case undefined:
          message.error("Không thể kết nối đến máy chủ.");
          break;
        default:
          if (status >= 500) {
            message.error("Lỗi hệ thống, vui lòng thử lại sau.");
          }
          break;
      }
    } else {
      message.error(apiError.message || "Đã xảy ra lỗi không xác định.");
    }

    return Promise.reject(apiError);
  },
);
