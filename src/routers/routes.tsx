import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import { Path } from '@/constants/appConstants';
import HomeSidebar from '@/pages/HomeSidebar/HomeSidebar';
import Buildings from '@/pages/buildings/Buildings';
import Home from '@/pages/home/Home';
import Rooms from '@/pages/rooms/Rooms';
import Tenant from '@/pages/tenant/Tenant';

import PrivateRoute from './PrivateRoute';

const LoginPage = lazy(() => import('@/pages/login/Login'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <HomeSidebar />,
        children: [
          {
            path: `/${Path.buildings}`,
            element: <Buildings />,
          },
          {
            path: `/${Path.rooms}`,
            element: <Rooms />,
          },
          {
            path: `/${Path.tenants}`,
            element: <Tenant />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const breadcrumbRoutes = [
  {
    path: '/',
    breadcrumb: 'Trang chủ',
  },
  {
    path: `/${Path.buildings}`,
    breadcrumb: 'Quản Lý Tòa Nhà',
  },
  {
    path: `/${Path.rooms}`,
    breadcrumb: 'Quản Lý Phòng',
  },
  {
    path: `/${Path.tenants}`,
    breadcrumb: 'Quản Lý Người Thuê',
  },
];
