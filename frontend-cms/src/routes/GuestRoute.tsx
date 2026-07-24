import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export const GuestRoute: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
