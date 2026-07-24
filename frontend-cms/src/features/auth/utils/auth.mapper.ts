import { normalizeFileUrl } from "../../../services/file.service";
import { AppPermission, ROLE_PERMISSIONS, mapApiRoles } from "../constants/access-control";
import type { AuthUser } from "../types/auth.type";
import type { AdminProfileData } from "../types/login.type";

export const mapAdminProfileToAuthUser = (
    data: AdminProfileData,
): AuthUser => {
    const roles = mapApiRoles(data.roles);
    const permissions = roles.flatMap((role) => [...(ROLE_PERMISSIONS[role] ?? [])]);

    return {
        id: data.id,
        name: ("fullName" in data && data.fullName) || data.userName || "",
        roles,
        permissions: permissions.length > 0 ? permissions : [AppPermission.ALL],
    };
};

export const mapToAdminProfile = (data: AdminProfileData): AdminProfileData => ({
    id: data.id,
    fullName: data.fullName,
    userName: data.userName,
    email: data.email,
    phone: data.phone,
    avatar: normalizeFileUrl(data.avatar),
    roles: mapApiRoles(data.roles),
    isActivated: data.isActivated
});