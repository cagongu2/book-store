import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const PlaceholderPage = lazy(() => import('../components/pages/PlaceholderPage'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <PlaceholderPage title="Dashboard" />
                ),
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}

