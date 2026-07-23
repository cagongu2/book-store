import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { uploadFiles } from "@/services/file.service";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const defaultBeforeUpload = (file: FileType) => {
  const isImage = file.type?.startsWith("image/");
  if (!isImage) message.error("Chỉ chấp nhận file ảnh!");

  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) message.error("Ảnh phải nhỏ hơn 10MB!");

  return Boolean(isImage && isLt10M);
};

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export interface UploadImageProps {
  fileList?: UploadFile[];
  onChange?: UploadProps["onChange"];
  maxCount?: number;
  disabled?: boolean;
  accept?: string;
  listType?: Extract<UploadProps["listType"], "picture-circle" | "picture-card">;
  uploadButtonText?: ReactNode | string;
  width?: number;
  height?: number;
  className?: string;
  icon?: ReactNode;
  uploadToServer?: boolean;
  beforeUploadValidator?: (file: FileType) => boolean | Promise<boolean>;
}

export const UploadImage = ({
  fileList = [],
  onChange,
  maxCount = 8,
  disabled = false,
  accept = "image/*",
  listType = "picture-card",
  uploadButtonText = "Upload",
  width,
  height,
  className,
  icon,
  uploadToServer = true,
  beforeUploadValidator = defaultBeforeUpload,
}: UploadImageProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadingCount, setUploadingCount] = useState(0);
  const uploading = uploadingCount > 0;

  const handleChange: UploadProps["onChange"] = (info) => {
    const fileList = info.fileList.map((file) => {
      const url = (file.response as { url?: string } | undefined)?.url;
      return url ? { ...file, url, thumbUrl: url, preview: undefined } : file;
    });

    onChange?.({ ...info, fileList });
  };

  const getImageSrc = (file: UploadFile) => {
    const responseUrl = (file.response as { url?: string } | undefined)?.url;
    return file.url || file.thumbUrl || responseUrl || file.preview || "";
  };

  const handlePreview = async (file: UploadFile) => {
    const src = getImageSrc(file);
    if (src) {
      setPreviewImage(src);
      setPreviewOpen(true);
      return;
    }

    if (!file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(getImageSrc(file));
    setPreviewOpen(true);
  };

  const uploadButton = (
    <button type="button" className="border-0 bg-transparent">
      {uploading ? <LoadingOutlined /> : icon || <PlusOutlined />}
      <div className="mt-2">{uploadButtonText}</div>
    </button>
  );

  const hasCustomSize = width != null && height != null;

  const handleBeforeUpload: UploadProps["beforeUpload"] = (file, selectedFiles) => {
    if (!uploadToServer) return false;

    const currentCount = fileList.length;
    const totalSelection = selectedFiles.length;

    if (currentCount + totalSelection > maxCount) {
      if (selectedFiles[0] === file) {
        message.warning(
          `Tổng số lượng hình ảnh không được vượt quá ${maxCount}. Vui lòng chọn lại.`,
        );
      }
      return Upload.LIST_IGNORE;
    }

    const isValid = beforeUploadValidator(file);
    if (isValid instanceof Promise) {
      return isValid.then((valid) => (valid ? true : Upload.LIST_IGNORE));
    }
    return isValid ? true : Upload.LIST_IGNORE;
  };

  return (
    <div
      style={
        hasCustomSize
          ? ({
            "--upload-width": `${width}px`,
            "--upload-height": `${height}px`,
          } as CSSProperties)
          : undefined
      }
      className={`${hasCustomSize ? "upload-image-sized" : undefined} ${className}`}
    >
      <Upload
        listType={listType}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={uploadToServer ? handleBeforeUpload : () => false}
        customRequest={
          uploadToServer
            ? async (options) => {
                const { file, onError, onSuccess } = options;
                try {
                  setUploadingCount((prev) => prev + 1);
                  const result = (await uploadFiles([file as File]))[0];
                  if (!result?.url) {
                    throw new Error("Upload failed");
                  }
                  onSuccess?.(
                    { url: result.url, filePath: result.filePath },
                    new XMLHttpRequest(),
                  );
                } catch (err) {
                  message.error("Upload ảnh thất bại");
                  onError?.(err as Error);
                } finally {
                  setUploadingCount((prev) => Math.max(0, prev - 1));
                }
              }
            : undefined
        }
        maxCount={maxCount}
        multiple={maxCount > 1}
        disabled={disabled}
        accept={accept}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          styles={{ root: { display: "none" } }}
          preview={{
            open: previewOpen,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};
