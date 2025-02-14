import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/orders",
                element: <div>Orders</div>
            },
            {
                path: "/about",
                element: <div>About</div>
            },
            {
                path: "/cart",
                element: <div>cart</div>
            },
            {
                path: "/checkout",
                element: <div>checkout</div>
            },
            {
                path: "/user-dashboard",
                element: <div>user-dashboard</div>
            },

        ]
    }
]);
export default router;