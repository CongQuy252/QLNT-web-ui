import { Fragment } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import GlobalSpinner from '@/components/ui/GlobalSpinner/GlobalSpinner';
import { LocalStorageKey, Path } from '@/constants/appConstants';
import { useGlobalQueryLoading } from '@/hooks/useGlobalQueryLoading';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem(LocalStorageKey.token);
  useGlobalQueryLoading();

  return isAuthenticated ? (
    <Fragment>
      <GlobalSpinner />
      <Outlet />
    </Fragment>
  ) : (
    <Navigate to={Path.login} replace />
  );
};

export default PrivateRoute;
