import { createBrowserRouter } from "react-router-dom";
import PlaceholderPage from "../components/common/PlaceholderPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PlaceholderPage title="Home (Đang cập nhật)" description="Trang chủ sẽ được xây dựng sau" />,
  },
  {
    path: "*",
    element: <PlaceholderPage title="404" description="Không tìm thấy trang" />,
  },
]);

export default router;
