import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';

import { routes } from './routes';

const router = createBrowserRouter(routes);

const AppRouter = () => (
  <Suspense fallback={<Spinner />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
