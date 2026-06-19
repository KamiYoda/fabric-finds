// lib/api/uploads.ts
import { apiRequest } from "./core";

export type UploadContext =
  | "profile"
  | "style_reference"
  | "portfolio"
  | "milestone"
  | "message";

export interface UploadResult {
  url: string;
  public_id: string;
}

export async function uploadFile(
  file: File,
  context: UploadContext = "style_reference",
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("context", context);

  const res = await apiRequest<any>("/uploads", {
    method: "POST",
    auth: true,
    formData: true,
    body: formData,
  });

  // Unwrap envelope
  const data =
    res && typeof res === "object" && res.data != null ? res.data : res;
  return data as UploadResult;
}