import type { AppPermission, AppRole } from "@/features/auth/constants/access-control";
import { useAuthorization } from "@/features/auth/hooks/useAuthorization";

interface Props {
    permission?: readonly AppPermission[];
    roles?: readonly AppRole[];
    children: React.ReactNode;
}

export const HasPermission = ({roles, permission, children}: Props) => {
    const { canAccess } = useAuthorization();
    if(!canAccess(roles, permission))
        return null;

    return children;
}

