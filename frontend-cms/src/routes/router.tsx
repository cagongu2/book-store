import { lazy, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getProfile } from '../store/slices/auth.action';

const PlaceholderPage = lazy(() => import('../components/pages/PlaceholderPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));

const router = createBrowserRouter([
    {
        element: <GuestRoute />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <PlaceholderPage title="Dashboard" />,
                    },
                ],
            },
        ],
    },
]);

export default function AppRouter() {
    const dispatch = useAppDispatch();
    const { accessToken, profile } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (accessToken && !profile) {
            dispatch(getProfile()).catch(() => {
                // Interceptor in axios-client will handle 401 and log out if token is expired/invalid
            });
        }
    }, [accessToken, profile, dispatch]);

    return <RouterProvider router={router} />;
}



