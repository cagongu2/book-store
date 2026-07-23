import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

interface Props {
  title?: ReactNode;
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  icon?: ReactNode;
  centered?: boolean;
  okType?: "primary" | "danger";
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  okButtonProps?: Parameters<typeof Modal.confirm>[0]["okButtonProps"];
  cancelButtonProps?: Parameters<typeof Modal.confirm>[0]["cancelButtonProps"];
  width?: number | string;
  zIndex?: number;
  className?: string;
}

export const confirmModal = (props: Props) => {
  const {
    title = "Confirm",
    content,
    okText = "Ok",
    cancelText = "Cancel",
    centered = true,
    okType = "danger",
    icon = <ExclamationCircleOutlined />,
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps,
    width,
    zIndex,
    className
  } = props;

  Modal.confirm({
    title,
    icon,
    content,
    okText,
    cancelText,
    centered,
    width,
    zIndex,
    okButtonProps: {
      danger: okType === "danger",
      shape: "round",
      ...okButtonProps,
    },
    cancelButtonProps: {
      className:
        "hover:text-[#146CE8]! hover:border-[#4A93ED]! active:text-[#146CE8]! active:border-[#4A93ED]!",
      shape: "round",
      ...cancelButtonProps,
    },
    className: `${className}`,
    onOk,
    onCancel,
  });
};
