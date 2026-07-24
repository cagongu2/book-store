import { ApiRouters } from "../constants/api-routes";
import { ApiResponse } from "../core/api/api-response";
import { axiosClient } from "../core/api/axios-client";


export const fileUrl = (filePath: string) =>
  `${ApiRouters.FILES}/${filePath}`;

export const normalizeFileUrl = (value?: string | null) => {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : fileUrl(value);
};

export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const response = await axiosClient.post(ApiRouters.FILES, formData, {
    headers: { Accept: "application/json" },
  });

  const filePaths = ApiResponse.from<string[]>(response.data).data ?? [];
  return filePaths.map((filePath) => ({ filePath, url: fileUrl(filePath) }));
};
