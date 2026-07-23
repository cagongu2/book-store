import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PlaceholderPage from '../components/pages/PlaceholderPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <PlaceholderPage title='Dashboard' />,
            },
        ],
    },
]);

export default router;
