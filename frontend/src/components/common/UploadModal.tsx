import React, { type ReactNode, useState } from "react";
import { Modal, Flex, Typography, Upload, Button, Progress } from "antd";
import {
  CloseOutlined,
  UploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  CloseCircleFilled,
  CheckCircleFilled
} from "@ant-design/icons";
import { formatOnlyDate } from "@/utils/format";
import { useAppSelector } from "@/store/hooks";
import { useResponsive } from "@/hooks/useResponsive";

const { Text } = Typography

interface UploadModalProps {
  title?: ReactNode;
  centered?: boolean;
  width?: number | string;
  zIndex?: number;
  open: boolean;
  className?: string;
  accept?: string;
  onClose: () => void | Promise<void>;
  onSuccess?: () => void;
  onUpload?: () => void | Promise<void>;
  getExampleFile?: () => void | Promise<void>;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  title,
  centered,
  width,
  zIndex,
  open,
  className,
  onClose,
  onSuccess,
  onUpload,
  getExampleFile,
  beforeUpload,
  accept
}) => {
  type UploadStatus = "idle" | "processing" | "success" | "error";
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const currentUser = useAppSelector((state) => state.auth.user);
  const uploaderName = currentUser?.name ?? "Admin";

  const { isMobile } = useResponsive()

  const handleClose = () => {
    if (status === "processing") return;
    setStatus("idle");
    setFile(null);
    setProgress(0);
    onClose();
  };

  const handleCancelFile = () => {
    setFile(null);
  };

  const handleStartUpload = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(0);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(timer);
          return 95;
        }
        return prev + 15;
      });
    }, 300);

    try {
      if (onUpload) {
        await onUpload();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      clearInterval(timer);
      setProgress(100);
      setStatus("success");
      onSuccess?.();
    } catch {
      clearInterval(timer);
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
  };

  const triggerUpload = () => {
    const input = document.querySelector('.custom-upload-modal-dragger input') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      width={width}
      centered={centered}
      closable={status !== "processing"}
      closeIcon={<CloseOutlined />}
      zIndex={zIndex}
      className={className || ""}
      styles={{
        container: {
          padding: 16
        },
        header: {
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: 16,
          margin: 0
        },
        body: {
          padding: 8,
        },
        footer: {
          borderTop: '1px solid #e5e7eb',
          paddingTop: 16,
          margin: 0
        }
      }}
      footer={() => (
        <Flex justify="flex-end" gap="8px">
          <Button
            size="large"
            shape="round"
            onClick={handleClose}
            type={status === "success" ? "primary" : "default"}
            disabled={status === "processing"}
          >
            {status === "success" ? "Đóng" : "Hủy"}
          </Button>

          {status === "idle" && file === null && (
            <Button
              size="large"
              type="primary"
              shape="round"
              onClick={triggerUpload}
            >
              Tải lên
            </Button>
          )}

          {status === "idle" && file !== null && (
            <Button
              size="large"
              type="primary"
              shape="round"
              onClick={handleStartUpload}
            >
              Tiếp tục
            </Button>
          )}

          {status === "processing" && (
            <Button
              size="large"
              type="primary"
              shape="round"
              loading
              disabled
            >
              Đang xử lý
            </Button>
          )}

          {status === "error" && (
            <Button
              size="large"
              type="primary"
              shape="round"
              onClick={handleRetry}
            >
              Tải lại
            </Button>
          )}
        </Flex>
      )}
    >
      <Flex vertical>
        <Flex>
          <Text style={{
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "21px",
            letterSpacing: 0,
            color: "#000000E0"
          }}>
            Vui lòng <a className="text-blue-600 hover:text-blue-500 hover:underline" style={{ textDecoration: "none" }} onClick={getExampleFile}> tải tệp </a>
            lên và điền thông tin theo hướng dẫn. Hãy đảm bảo dữ liệu được nhập đúng định dạng yêu cầu.
            Nếu cần hỗ trợ, vui lòng liên hệ bộ phận hỗ trợ.
          </Text>
        </Flex>

        {status === "idle" && file === null && (
          <Flex style={{ padding: '16px 0 8px' }}>
            <Upload.Dragger
              accept={accept}
              showUploadList={false}
              beforeUpload={(file) => {
                const result = beforeUpload?.(file) ?? true;
                if (result) {
                  setFile(file);
                }
                return false;
              }}
              className="w-full custom-upload-modal-dragger"
              style={{
                background: "#F9FAFB",
                border: "1px dashed #E5E7EB",
                borderRadius: "12px",
                padding: 0,
              }}
            >
              <Flex vertical align="center" justify="center" gap={8}>
                <UploadOutlined style={{ fontSize: 48, color: "#00000073" }} />
                <Text style={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#000000E0",
                  lineHeight: "21px"
                }}>
                  Kéo và thả tệp vào đây hoặc nhấp để chọn tệp
                </Text>
                <Text style={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#000000A6",
                  lineHeight: "21px"
                }}>
                  Chỉ chấp nhận định dạng {accept ?? 'xlsx'}.
                </Text>
              </Flex>
            </Upload.Dragger>
          </Flex>
        )}

        {file !== null && status !== "success" && (
          <Flex
            align="center"
            justify="space-between"
            style={{
              border: "1px solid #EAECF0",
              borderRadius: 16,
              padding: isMobile ? "16px" : "16px 20px",
              background: "#FFFFFF",
              marginTop: 16,
              marginBottom: 8,
              width: "100%"
            }}
          >
            <Flex align="start" gap={isMobile ? 8 : 16}>
              <PaperClipOutlined style={{ fontSize: 22, color: "#98A2B3" }} />
              <Flex vertical gap={4}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1570EF",
                    textDecoration: "none"
                  }}
                  className="hover:underline"
                >
                  {file.name}
                </a>
                <span style={{ fontSize: "13px", color: "#667085" }}>
                  Tải lên bởi {uploaderName} | {formatOnlyDate(new Date(file.lastModified).toISOString())}
                </span>
              </Flex>
            </Flex>
            {status !== "processing" && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined style={{ fontSize: 16, color: "#FF4D4F" }} />}
                onClick={handleCancelFile}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "8px"
                }}
              />
            )}
          </Flex>
        )}

        {status === "processing" && (
          <Flex vertical style={{ padding: '8px 0' }}>
            <Text style={{
              fontWeight: 600,
              fontSize: 14,
              lineHeight: "21px",
              letterSpacing: 0,
              color: "#000000E0"
            }}>Đang xử lý...</Text>
            <Text style={{
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "21px",
              letterSpacing: 0,
              color: "#000000E0"
            }}>
              Vui lòng không đóng hoặc tải lại trang cho đến khi quá trình hoàn tất.
            </Text>
            <Progress
              percent={progress}
              size="small"
              showInfo={false}
              style={{ marginTop: 16 }}
            />
          </Flex>
        )}

        {status === "error" && (
          <Flex gap={12} orientation="horizontal" align="start"
            className="border border-[#FFA39E] bg-[#FFF1F0] p-4! rounded-xl my-2!">
            <CloseCircleFilled style={{ color: "#FF4D4F" }} className="text-xl! shrink-0" />
            <Flex vertical gap={4}>
              <span className="font-normal text-sm text-black/88">Nhập dữ liệu không thành công</span>
              <span className="font-normal text-sm text-black/88">Vui lòng kiểm tra lại định dạng và cấu trúc file theo mẫu quy định</span>
            </Flex>
          </Flex>
        )}

        {status === "success" && (
          <Flex gap={12} orientation="horizontal" align="start"
            className="border border-[#B7EB8F] bg-[#F6FFED] p-4! rounded-xl my-2!">
            <CheckCircleFilled style={{ color: "#389E0D" }} className="text-xl! shrink-0" />
            <Flex vertical gap={4}>
              <span className="font-normal text-sm text-black/88">Nhập dữ liệu thành công</span>
              <span className="font-normal text-sm text-black/88">Dữ liệu từ file đã được cập nhật vào hệ thống</span>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Modal >
  );
};
export default UploadModal;
