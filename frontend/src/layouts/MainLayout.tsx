// src/layouts/MainLayout.tsx
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppSideBar from "../components/AppSideBar";
import AppHeader from "../components/AppHeader";
import { useState } from "react";

const { Content } = Layout;

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Layout className="h-screen overflow-hidden bg-white">
      <AppSideBar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <Layout className="flex flex-col h-full min-h-0 overflow-hidden bg-white">
        <AppHeader
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen((open) => !open)}
        />

        <Content className="flex-1 min-h-0 overflow-y-auto bg-white px-3! pt-3! md:px-4! md:pt-4! pb-3! md:pb-4! has-data-footer-sticky:pb-0!">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
