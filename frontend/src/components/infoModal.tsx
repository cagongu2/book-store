import { Modal } from "antd";
import type { ReactNode } from "react";

interface Props {
    title?: ReactNode;
    content: ReactNode;
    okText?: string;
    cancelText?: string;
    icon?: ReactNode | boolean;
    centered?: boolean;
    okType?: "primary" | "danger";
    onOk?: () => void | Promise<void>;
    onCancel?: () => void;
    okButtonProps?: Parameters<typeof Modal.info>[0]["okButtonProps"];
    cancelButtonProps?: Parameters<typeof Modal.info>[0]["cancelButtonProps"];
    width?: number | string;
    zIndex?: number;
}

export const infoModal = (props: Props) => {
    const {
        title = "Confirm",
        content,
        okText = "Ok",
        cancelText = "Cancel",
        centered = true,
        okType = "danger",
        icon,
        onOk,
        onCancel,
        okButtonProps,
        cancelButtonProps,
        width,
        zIndex,
    } = props;


    Modal.info({
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
            ...okButtonProps,
        },
        cancelButtonProps: {
            className:
                "hover:text-[#146CE8]! hover:border-[#4A93ED]! active:text-[#146CE8]! active:border-[#4A93ED]!",
            ...cancelButtonProps,
        },
        onOk,
        onCancel,
    });
};

