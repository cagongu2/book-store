import { useAppSelector } from "../../../store/hooks";
import type { AppPermission, AppRole } from "../constants/access-control";
import { hasAllowedRoles, hasRequiredPermission as hasRequiredPermissions } from "../utils/access-control";


export function useAuthorization() {
    const user = useAppSelector((state) => state.auth.user);
    const roles = user?.roles ?? [];
    const permissions = user?.permissions ?? [];

    return {
        roles,
        permissions,
        hasRole: (allowedRoles: readonly AppRole[]) => hasAllowedRoles(roles, allowedRoles),
        hasPermission: (requiredPermissions: readonly AppPermission[]) => hasRequiredPermissions(permissions, requiredPermissions),
        canAccess: (allowRoles: readonly AppRole[], requiredPermissions: readonly AppPermission[]) =>
            hasAllowedRoles(roles, allowRoles) && hasRequiredPermissions(permissions, requiredPermissions),
    };
}
