import { Button, type ButtonProps } from "antd";
import type { ReactNode } from "react";

export type AppButtonProps = ButtonProps;

const isTextChild = (children: ReactNode) =>
  typeof children === "string" || typeof children === "number";

export const AppButton = ({
  type = "primary",
  shape = "round",
  size = "large",
  className,
  children,
  ...rest
}: AppButtonProps) => {
  return (
    <Button
      type={type}
      shape={shape}
      size={size}
      className={["min-w-0! max-w-full! overflow-hidden!", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {isTextChild(children) ? <span className="block truncate">{children}</span> : children}
    </Button>
  );
};
