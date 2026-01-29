import { Navigate, Outlet } from 'react-router-dom';

import { Path } from '@/constants/appConstants';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Outlet /> : <Navigate to={Path.login} replace />;
};

export default PrivateRoute;
