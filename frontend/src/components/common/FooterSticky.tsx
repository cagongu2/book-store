import type { PropsWithChildren } from "react";
import { Flex } from "antd";
import { Footer } from "antd/es/layout/layout";
import { useResponsive } from "@/hooks/useResponsive";

interface FooterStickyProps extends PropsWithChildren {
  className?: string;
}

export const FooterSticky = ({ children, className = "" }: FooterStickyProps) => {
  const { isMobile } = useResponsive();

  const baseClassName =
    `sticky bottom-0 z-100! mt-auto bg-white! p-0! ` +
    (isMobile
      ? "-mx-3! border-t border-[#0000000F] px-3! py-3!"
      : "-mx-4! border-t border-[#0000000F] px-4! py-4!");

  return (
    <Footer
      data-footer-sticky
      className={`${baseClassName} ${className}`.trim()}
    >
      <Flex
        justify={isMobile ? "space-between" : "flex-end"}
        gap={isMobile ? 8 : 16}
      >
        {children}
      </Flex>
    </Footer>
  );
};

