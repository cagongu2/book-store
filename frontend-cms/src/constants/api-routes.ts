import { ENV } from "./env";

const BASE_URL = `${ENV.END_POINT}/api/v1`;

export const ApiRouters = {
  AUTH: `${BASE_URL}/auth`,
  PROFILE: `${BASE_URL}/auth`,
  FILES: `${BASE_URL}/files`,
  BOOKS: `${BASE_URL}/books`,
  CATEGORIES: `${BASE_URL}/categories`,
  ORDERS: `${BASE_URL}/orders`,
};
