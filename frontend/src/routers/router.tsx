import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../features/home/pages/Home";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CartPage from "../features/orders/pages/CartPage";
import CheckoutPage from "../features/orders/pages/CheckoutPage";
import SingleBook from "../features/books/pages/SingleBook";
import PrivateRoute from "../routers/PrivateRoute";
import OrderPage from "../features/orders/pages/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../features/auth/pages/AdminLogin";
import DashboardLayout from "../features/dashboard/pages/DashboardLayout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ManageBooks from "../features/books/pages/ManageBooks";
import UpdateBook from "../features/books/pages/UpdateBook";
import AddBook from "../features/books/pages/AddBook";
import UserDashboard from "../features/auth/pages/UserDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/orders",
        element: <OrderPage />,
      },
      {
        path: "/about",
        element: <div>About</div>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/books/:id",
        element: <SingleBook />,
      },
      {
        path: "/user-dashboard",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "/index",
      //   element: <index />,
      // },
    ],
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },
      {
        path: "add-new-book",
        element: (
          <AdminRoute>
            <AddBook />
          </AdminRoute>
        ),
      },
      {
        path: "edit-book/:id",
        element: (
          <AdminRoute>
            <UpdateBook />
          </AdminRoute>
        ),
      },
      {
        path: "manage-books",
        element: (
          <AdminRoute>
            <ManageBooks />
          </AdminRoute>
        ),
      },
    ],
  },
]);
export default router;
