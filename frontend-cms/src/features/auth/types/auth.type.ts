import type { AppPermission, AppRole } from "../constants/access-control";

export interface AuthUser {
    id: string;
    name: string;
    roles: AppRole[];
    permissions: AppPermission[];
}

export interface AuthSession {
    accessToken: string;
    user: AuthUser;
}