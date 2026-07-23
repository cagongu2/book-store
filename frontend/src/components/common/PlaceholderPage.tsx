import { Flex, Typography } from "antd";

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <Flex vertical>
      <Typography.Title level={5} className="text-[#000000E0]!">
        {title}
      </Typography.Title>
      <Typography.Text type="secondary">
        Trang đang được phát triển.
      </Typography.Text>
    </Flex>
  );
};

export default PlaceholderPage;
