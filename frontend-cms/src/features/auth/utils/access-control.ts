import { AppPermission, type AppRole } from "../constants/access-control";

export const hasAllowedRoles = (
    userRoles: readonly AppRole[],
    allowedRoles: readonly AppRole[],
): boolean => {
    if (!allowedRoles?.length)
        return true;

    return allowedRoles.some(role => userRoles.includes(role));
};


export const hasRequiredPermission = (
    userPermissions: readonly AppPermission[],
    requiredPermissions: readonly AppPermission[],
): boolean => {
    if (!requiredPermissions?.length)
        return true;

    if (userPermissions.includes(AppPermission.ALL))
        return true;

    return requiredPermissions.every(permission =>
        userPermissions.includes(permission));
};

