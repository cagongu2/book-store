import axios, {
  type InternalAxiosRequestConfig,
} from "axios";
import queryString from "query-string";
import { message } from "antd";
import { ApiError } from "./api-error";
import { ENV } from "../../constants/env";


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
    // const token = getAccessToken();
    // if (token) {
    //   config.headers.set("Authorization", `Bearer ${token}`);
    // }
    return config;
  },
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = ApiError.from(error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      switch (status) {
        case 401:
          // store.dispatch(logOut());
          message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");

          // if (window.location.pathname !== ROUTES.AUTH.LOGIN) {
          //   window.location.href = ROUTES.AUTH.LOGIN;
          // }
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
