import { ExclamationCircleOutlined } from "@ant-design/icons";
import { confirmModal } from "@/components/confirmModal";
import type { FormInstance } from "antd";

interface ConfirmUnsavedChangesOptions {
  form?: FormInstance;
  onClose?: () => void;
  beforeDiscard?: () => void;
  onContinueEditing?: () => void;
}

export const confirmUnsavedChanges = ({
  form,
  onClose,
  beforeDiscard,
  onContinueEditing,
}: ConfirmUnsavedChangesOptions) => {
  confirmModal({
    title: "Thông tin chưa được lưu",
    icon: <ExclamationCircleOutlined style={{ color: "#FAAD14" }} />,
    content:
      "Bạn có các thông tin chưa được lưu và chúng sẽ bị mất. Bạn có chắc chắn muốn thoát mà không lưu không?",
    okText: "Tiếp tục chỉnh sửa",
    cancelText: "Thoát không lưu",
    okType: "primary",
    okButtonProps: {
      style: { 
        background: "#146CE8", 
        borderColor: "#146CE8" 
      },
    },
    cancelButtonProps: {
      style: {
        background: "#DEE4ED!important",
        borderColor: "#DEE4ED!important",
      },
    },
    onOk: () => {
      onContinueEditing?.();
    },
    onCancel: () => {
      beforeDiscard?.();
      form?.resetFields();
      onClose?.();
    },
  });
};
