import { compressImageIfOverLimit } from "./client-image-compressor";

export interface UploadedAsset {
  id: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number | null;
  format: string | null;
  alt: string | null;
  folder: string | null;
  secureUrl?: string;
  createdAt?: Date;
}

export interface UploadOptions {
  alt?: string;
  folder?: string;
  onProgress?: (percent: number) => void;
  onStatusChange?: (status: "compressing" | "uploading" | "complete") => void;
}

/**
 * Uploads an image file directly from the user's device with:
 * 1. Automatic compression if > 10MB (visual quality preserved)
 * 2. Real-time upload progress tracking (0% to 100%)
 */
export async function uploadImageFromDevice(
  file: File,
  options: UploadOptions = {},
): Promise<UploadedAsset> {
  // Step 1: Check size and compress if over 10MB
  options.onStatusChange?.("compressing");
  const processedFile = await compressImageIfOverLimit(file);

  // Step 2: Upload via XMLHttpRequest with progress tracking
  options.onStatusChange?.("uploading");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", processedFile);
    if (options.alt) formData.append("alt", options.alt);
    if (options.folder) formData.append("folder", options.folder);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && options.onProgress) {
        const percent = Math.min(
          99,
          Math.round((event.loaded / event.total) * 100),
        );
        options.onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.asset) {
            options.onProgress?.(100);
            options.onStatusChange?.("complete");
            resolve(res.asset as UploadedAsset);
          } else {
            reject(new Error(res.error || "Failed to process upload"));
          }
        } catch {
          reject(new Error("Invalid response from upload server"));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.error || `Upload error (HTTP ${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed with status code ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network connection error during file upload"));
    };

    xhr.open("POST", "/api/admin/upload", true);
    xhr.send(formData);
  });
}
