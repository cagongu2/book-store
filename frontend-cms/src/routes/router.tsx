import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/home/Home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            // Thêm các route khác ở đây (VD: books, users)
        ],
    },
    {
        path: '*',
        element: (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-3xl font-bold">404 - Không tìm thấy trang</h1>
            </div>
        ),
    },
]);

export default router;
