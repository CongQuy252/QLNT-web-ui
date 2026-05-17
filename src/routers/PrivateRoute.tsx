/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

import GlobalSpinner from '@/components/ui/globalSpinner/GlobalSpinner';
import { LocalStorageKey, Path } from '@/constants/appConstants';
import { useGlobalQueryLoading } from '@/hooks/useGlobalQueryLoading';

interface PrivateRouteProps {
  allowedRoles?: number[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const token = localStorage.getItem(LocalStorageKey.token);
  const isAuthenticated = !!token;

  const role = token ? jwtDecode<{ role?: number }>(token).role : undefined;

  useGlobalQueryLoading();

  // ❌ Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={Path.login} replace />;
  }

  // ❌ Không đủ quyền
  if (allowedRoles && (role == null || !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return (
    <Fragment>
      <GlobalSpinner />
      <Outlet />
    </Fragment>
  );
};

export default PrivateRoute;
