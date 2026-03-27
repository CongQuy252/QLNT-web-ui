import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import { Path, UserRole } from '@/constants/appConstants';
import HomeSidebar from '@/pages/HomeSidebar/HomeSidebar';
import Buildings from '@/pages/buildings/Buildings';
import Home from '@/pages/home/Home';
import Payment from '@/pages/payment/Payment';
import PaymentDetail from '@/pages/paymentDetail/PaymentDetail';
import Rooms from '@/pages/rooms/Rooms';
import Statistics from '@/pages/statistics/Statistics';
import Tenant from '@/pages/tenant/Tenant';

import PrivateRoute from './PrivateRoute';

const LoginPage = lazy(() => import('@/pages/login/Login'));
const CreateBuildingPage = lazy(() => import('@/pages/buildings/CreateBuildingPage'));
const CreatePaymentPage = lazy(() => import('@/pages/payment/Createpayment'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PrivateRoute />, // ✅ chỉ check login
    children: [
      { index: true, element: <Home /> },

      {
        element: <HomeSidebar />,
        children: [
          // ================= ADMIN ONLY =================
          {
            element: <PrivateRoute allowedRoles={[UserRole.admin]} />,
            children: [
              {
                path: `/${Path.buildings}`,
                element: <Buildings />,
              },
              {
                path: `/${Path.buildings}/create`,
                element: <CreateBuildingPage />,
              },
              {
                path: `/${Path.rooms}`,
                element: <Rooms />,
              },
              {
                path: `/${Path.tenants}`,
                element: <Tenant />,
              },
              {
                path: `/${Path.buildings}/${Path.buildingId}/${Path.rooms}`,
                element: <Rooms />,
              },
              {
                path: `/${Path.statistics}`,
                element: <Statistics />,
              },
            ],
          },

          // ================= ADMIN + TENANT =================
          {
            element: <PrivateRoute allowedRoles={[UserRole.admin, UserRole.tenant]} />,
            children: [
              {
                path: `/${Path.payments}`,
                element: <Payment />,
              },
              {
                path: `/${Path.createpayment}`,
                element: <CreatePaymentPage />,
              },
              {
                path: `/${Path.payments}/${Path.paymentId}`,
                element: <PaymentDetail />,
              },
            ],
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
    path: `/${Path.buildings}/create`,
    breadcrumb: 'Thêm Tòa Nhà Mới',
  },
  {
    path: `/${Path.rooms}`,
    breadcrumb: 'Quản Lý Phòng',
  },
  {
    path: `/${Path.tenants}`,
    breadcrumb: 'Quản Lý Người Thuê',
  },
  {
    path: `/${Path.statistics}`,
    breadcrumb: 'Thống Kê',
  },
];
