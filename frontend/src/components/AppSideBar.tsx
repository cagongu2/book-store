import {
  Layout,
  Menu,
  Button,
  Drawer,
  Avatar,
  Typography,
  Image,
  Flex,
  Card,
  Divider,
} from "antd";
import {
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { appImages } from "../constants/app-info";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/ui-slice";
import { useState } from "react";
import type { MenuProps } from "antd";
import { sidebarMenuConfig } from "@/app/router/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { logOut } from "@/store/slices/auth-slice";
import { ROUTES } from "@/constants/routes";
import { normalizeFileUrl } from "@/services/file.service";
import { FooterSticky } from "@/components/common/FooterSticky";
import { AppButton } from "./common/AppButton";

const { Sider } = Layout;

const getParentKeyForPath = (pathname: string) =>
  sidebarMenuConfig.find((item) =>
    item.children?.some(
      (child) =>
        pathname === child.key || pathname.startsWith(`${child.key}/`),
    ),
  )?.key;

const getSelectedKey = (pathname: string) => {
  const selectedChildKey = sidebarMenuConfig
    .flatMap((item) => item.children ?? [])
    .find(
      (child) =>
        pathname === child.key || pathname.startsWith(`${child.key}/`),
    )?.key;

  const selectedParentKey = sidebarMenuConfig.find(
    (item) => pathname === item.key || pathname.startsWith(`${item.key}/`),
  )?.key;

  return selectedChildKey ?? selectedParentKey ?? pathname;
};

const menuItems: MenuProps["items"] = sidebarMenuConfig.map((item) => ({
  key: item.key,
  icon: item.icon ? <item.icon /> : undefined,
  label: item.label,
  children: item.children?.map((child) => ({
    key: child.key,
    label: child.label,
  })),
}));

interface AppSideBarProps {
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

const AppSideBar = ({
  isMobileMenuOpen = false,
  onCloseMobileMenu,
}: AppSideBarProps) => {
  const { isDesktop, isMobile } = useResponsive();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [manualOpenKeys, setManualOpenKeys] = useState<string[]>([]);
  const [manualPathname, setManualPathname] = useState("");

  const autoOpenKey = getParentKeyForPath(location.pathname);
  const selectedKey = getSelectedKey(location.pathname);

  const manualKeysForCurrentPath =
    manualPathname === location.pathname ? manualOpenKeys : null;

  const openKeys = manualKeysForCurrentPath ?? (autoOpenKey ? [autoOpenKey] : []);

  const onMenuClick: MenuProps["onClick"] = (event) => {
    navigate(event.key);
    if (!isDesktop) {
      onCloseMobileMenu?.();
    }
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate(ROUTES.AUTH.LOGIN);
    onCloseMobileMenu?.();
  };

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      openKeys={!!isDesktop && collapsed ? [] : openKeys}
      onOpenChange={(keys) => {
        setManualOpenKeys(keys as string[]);
        setManualPathname(location.pathname);
      }}
      onClick={onMenuClick}
      items={menuItems}
      className="border-none!"
    />
  );

  if (!isDesktop) {
    return (
      <Drawer
        placement="right"
        open={isMobileMenuOpen}
        onClose={onCloseMobileMenu}
        closeIcon={false}
        width={isMobile ? "100%" : 280}
        classNames={{ body: "p-0! overflow-x-hidden!" }}
      >
        <Flex vertical className="h-full min-h-full bg-white ">
          <Flex
            align="center"
            justify="space-between"
            className="border-b border-b-[#0000000F] p-3!"
          >
            <Image
              src={appImages.logoMebipha}
              alt="logo"
              preview={false}
              className="h-10! w-auto! object-contain"
            />

            <Button type="text" icon={<CloseOutlined />} onClick={onCloseMobileMenu} />
          </Flex>

          <Flex vertical>
            <Flex vertical className="flex-1 overflow-y-auto p-3!">
              <Card
                size="small"
                className="rounded-xl border-[#146CE8]! bg-[#F2F8FF]!"
                onClick={() => (navigate(ROUTES.PROFILE), onCloseMobileMenu?.())}
              >
                <Flex align="center" gap={12} className="min-w-0">
                  <Avatar
                    size={44}
                    src={normalizeFileUrl(profile?.avatar) ?? undefined}
                    icon={<UserOutlined />}
                  />
                  <Flex vertical className="min-w-0 flex-1">
                    <Typography.Text strong ellipsis className="block!">
                      {user?.name || "Admin"}
                    </Typography.Text>
                    <Typography.Text type="secondary" className="block! text-xs!">
                      {user?.roles?.[0] || "Admin"}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
            <Divider className="my-0!" />

            <Flex vertical className="p-3!">
              {menu}
            </Flex>
          </Flex>


          <FooterSticky className="py-6! px-7! mx-0!">
            <AppButton
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="p-0!"
            >
              Đăng xuất
            </AppButton>
          </FooterSticky>
        </Flex>
      </Drawer>
    );
  }

  return (
    <Sider
      width={280}
      collapsedWidth={80}
      collapsed={collapsed}
      theme="light"
      className="h-screen! overflow-hidden!"
    >
      <div className="flex h-[65px] items-center justify-center gap-3 border-b border-b-[#E5E7EB] py-3">
        <img src={appImages.logo} alt="logo" width={38} height={40} />
        {!collapsed && (
          <>
            <div className="h-[33px] w-px bg-[#EDF1F7]" />
            <h3 className="font-bold text-[#146CE8]">
              Trung tâm <br /> quản lý bán hàng{" "}
            </h3>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto border-r border-r-[#F0F0F0] p-4">
        {menu}
      </div>

      <div className="flex h-14 items-center justify-center border-r border-[#F0F0F0]">
        <Button
          icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
          onClick={() => dispatch(toggleSidebar())}
        />
      </div>
    </Sider>
  );
};

export default AppSideBar;
