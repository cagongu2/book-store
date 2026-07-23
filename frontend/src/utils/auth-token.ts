import Cookies from "js-cookie";
import {
  MEBIPHA_ACCESS_TOKEN,
  MEBIPHA_REFRESH_TOKEN,
} from "@/constants/cookies";

const COOKIE_OPTIONS = {
  path: "/",
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
  sameSite: "Lax" as const,
};

const getExpiryDate = (expiresInSeconds?: number): Date | undefined => {
  if (!expiresInSeconds || expiresInSeconds <= 0) return undefined;
  return new Date(Date.now() + expiresInSeconds * 1000);
};

export interface TokenPayload {
  access: string;
  refresh?: string;
  accessExpiresIn?: number;
}

export const setTokenAuth = (payload: TokenPayload) => {
  Cookies.set(MEBIPHA_ACCESS_TOKEN, payload.access, {
    ...COOKIE_OPTIONS,
    expires: getExpiryDate(payload.accessExpiresIn),
  });

  if (payload.refresh) {
    Cookies.set(MEBIPHA_REFRESH_TOKEN, payload.refresh, {
      ...COOKIE_OPTIONS,
      expires: 3,
    });
  }
};

export const removeTokenAuth = () => {
  Cookies.remove(MEBIPHA_ACCESS_TOKEN, { path: "/" });
  Cookies.remove(MEBIPHA_REFRESH_TOKEN, { path: "/" });
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get(MEBIPHA_ACCESS_TOKEN);
};
