import Cookies from "js-cookie";
import { BOOKSTORE_ACCESS_TOKEN, BOOKSTORE_REFRESH_TOKEN } from "../constants/cookies";

const COOKIE_OPTIONS = {
    path: "/",
    secure: typeof window !== "undefined" && window.location.protocol === "https:",
    sameSite: "Lax" as const,
}

export interface TokenPayload {
    access: string;
    refresh?: string;
    accessExpiresIn?: number;
}

export const setTokenAuth = (payload: TokenPayload) => {
    Cookies.set(BOOKSTORE_ACCESS_TOKEN, payload.access, COOKIE_OPTIONS)

    if (payload.refresh) {
        Cookies.set(BOOKSTORE_REFRESH_TOKEN, payload.refresh, { ...COOKIE_OPTIONS, expires: 3 });
    }
};

export const removeTokenAuth = () => {
    Cookies.remove(BOOKSTORE_ACCESS_TOKEN, { path: '/' })
    Cookies.remove(BOOKSTORE_REFRESH_TOKEN, { path: '/' })
};

export const getAccessToken = (): string | undefined => {
    return Cookies.get(BOOKSTORE_ACCESS_TOKEN)
}