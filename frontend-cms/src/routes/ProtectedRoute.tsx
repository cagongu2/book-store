import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useAuthorization } from '../features/auth/hooks/useAuthorization';
import type { AppPermission, AppRole } from '../features/auth/constants/access-control';
import { ROUTES } from '../constants/routes';

interface ProtectedRouteProps {
  allowedRoles?: readonly AppRole[];
  requiredPermissions?: readonly AppPermission[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requiredPermissions,
  children,
}) => {
  const location = useLocation();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { canAccess } = useAuthorization();

  if (!accessToken) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  if (!canAccess(allowedRoles, requiredPermissions)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  return children ?? <Outlet />
};

export default ProtectedRoute;
