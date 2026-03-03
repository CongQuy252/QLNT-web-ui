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

  let role = 0;

  if (token) {
    const decoded: any = jwtDecode(token);
    role = decoded.role;
  }

  useGlobalQueryLoading();

  // ❌ Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={Path.login} replace />;
  }

  // ❌ Không đủ quyền
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <Fragment>
      <GlobalSpinner />
      <Outlet />
    </Fragment>
  );
};

export default PrivateRoute;
