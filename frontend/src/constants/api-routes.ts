import { ENV } from "./env";

const ENDPOINT_URL = ENV.END_POINT
const API = '/api'
const VERSION = '/v1'
const SITE = '/cms'
const BASE_URL = `${ENDPOINT_URL + API + VERSION + SITE}`
const BASE_API_URL = `${ENDPOINT_URL + API + VERSION}`

export const ApiRouters = {
  PRODUCT: {
    LIST: BASE_URL + "/products",
  },
  CATEGORY: {
    LIST: BASE_URL + "/categories",
  },
  AUTH: BASE_URL + "/auth",
  PROFILE: BASE_URL + "/profile",
  BANNER: BASE_URL + "/banners",
  CUSTOMERS: BASE_URL + "/users",
  ADDRESSES: BASE_URL + "/addresses",
  ORDERS: BASE_URL + "/orders",
  BASKET: BASE_URL + "/baskets",
  DELIVERY_METHODS: BASE_API_URL + "/delivery-methods",
  PAYMENT_METHODS: BASE_API_URL + "/payment-methods",
  STORE_PROVINCES: BASE_API_URL + "/store/provinces",
  STORE_WARDS: BASE_API_URL + "/store/wards",
  FILES: BASE_API_URL + "/files",
  VOUCHER: BASE_URL + "/promotions",
} as const;
