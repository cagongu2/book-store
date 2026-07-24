import { ENV } from "./env"

const ENDPOINT_URL = ENV.END_POINT
const API = '/api'
const VERSION = '/v1'
const SITE = '/cms'
const BASE_URL = `${ENDPOINT_URL + API + VERSION + SITE}`

export const ApiRouters = {
  AUTH: BASE_URL + "/auth",
  PROFILE: BASE_URL + "/profile",
  FILES: BASE_URL + "/files",
};
