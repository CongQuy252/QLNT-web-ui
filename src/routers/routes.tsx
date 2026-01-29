import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import Home from '@/pages/home/Home';

import PrivateRoute from './PrivateRoute';

const LoginPage = lazy(() => import('@/pages/login/Login'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      { index: true, element: <Home /> },
      // {
      //   path: '/user',
      //   element: <Chat000 />,
      //   children: [
      //     {
      //       index: true,
      //       element: <Chat001 />,
      //     },
      //     {
      //       path: Path.chat002,
      //       element: <Chat002 />,
      //     },
      //     {
      //       path: Path.chat003,
      //       element: <Chat003 />,
      //     },
      //     {
      //       path: Path.userId,
      //       element: <Chat003 />,
      //     },
      //   ],
      // },
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
