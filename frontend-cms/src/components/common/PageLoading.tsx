import { Spin } from "antd";

export const PageLoading = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <Spin size="large" />
    </div>
  );
};

export default PageLoading;
