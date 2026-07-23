import { Avatar, Badge, Button, Divider, Layout, Typography, Dropdown, Flex, Image } from "antd";
import type { MenuProps } from "antd";
import {
  BarsOutlined,
  BellOutlined,
  CloseOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useResponsive } from "@/hooks/useResponsive";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logOut } from "@/store/slices/auth-slice";
import { normalizeFileUrl } from "@/services/file.service";
import { appImages } from "@/constants/app-info";
import { AppButton } from "./common/AppButton";

const { Header } = Layout;

interface AppHeaderProps {
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

const AppHeader = ({
  isMobileMenuOpen = false,
  onToggleMobileMenu,
}: AppHeaderProps) => {
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);

  const handleLogout = () => {
    dispatch(logOut());
    navigate(ROUTES.AUTH.LOGIN);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (!isDesktop) {
    return (
      <Header className="bg-white! p-3! flex items-center border-b border-b-[#0000000F]">
        <div className="flex min-w-0 flex-1 items-center">
          <Image
            src={appImages.logoMebipha}
            alt="logo"
            preview={false}
            className="h-10! w-auto! object-contain"
          />
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            type="text"
            shape="default"
            size="middle"
            aria-label="Thông báo"
            className="flex items-center justify-center overflow-visible!"
          >
            <Badge
              count={10}
              size="small"
              offset={[4, -3]}
              className="notification-badge"
            >
              <BellOutlined className="text-[21px] text-[#202124]" />
            </Badge>
          </AppButton>

          <AppButton
            type="text"
            aria-label="Menu"
            icon={isMobileMenuOpen ? <CloseOutlined /> : <BarsOutlined />}
            onClick={onToggleMobileMenu}
          />
        </div>
      </Header>
    );
  }

  return (
    <Header
      className="bg-white! px-4! py-3! md:px-6! flex items-center h-[65px]! border-b border-b-[#E5E7EB]"
    >
      <div className="ml-auto flex h-full items-center">
        <Button
          type="text"
          aria-label="Thông báo"
          className="flex items-center justify-center"
        >
          <Badge
            count={10}
            size="small"
            offset={[4, -3]}
            className="notification-badge"
          >
            <BellOutlined className="text-[21px] text-[#202124]" />
          </Badge>
        </Button>

        <Divider orientation="vertical" className="h-full! mx-4!" />

        <Dropdown
          menu={{ items: menuItems }}
          trigger={!isDesktop ? ["click"] : ["hover"]}
          placement="bottomRight"
          popupRender={(menu) => (
            <div className="pt-2!">{menu}</div>
          )}
        >
          <Button
            type="text"
            className="flex h-auto cursor-pointer items-center gap-3! p-0! hover:bg-transparent!"
          >
            <Avatar 
              size={40} 
              src={normalizeFileUrl(profile?.avatar) ?? undefined}
              icon={<UserOutlined />} 
            />
            <Flex vertical justify="center" className="hidden sm:flex">
              <Typography.Text
                strong
                ellipsis
                className="max-w-[180px]! text-[16px] text-[#000000E0]"
              >
                {user?.name || "Admin"}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                ellipsis
                className="max-w-[180px]! text-xs!"
              >
                {user?.roles?.[0] || "Admin"}
              </Typography.Text>
            </Flex>
            <DownOutlined className="text-[12px]" />
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
