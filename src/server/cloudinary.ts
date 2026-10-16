import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export {
  ALLOWED_IMAGE_FORMATS,
  ALLOWED_MIME_TYPES,
  ALLOWED_UPLOAD_FOLDERS,
  MAX_UPLOAD_BYTES,
} from "@/lib/constants/security";

/**
 * Generates an authorized signature for direct browser-to-Cloudinary uploads
 */
export function generateCloudinarySignature(
  paramsToSign: Record<string, string | number>,
): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
} {
  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    ...paramsToSign,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    env.CLOUDINARY_API_SECRET,
  );

  return {
    signature,
    timestamp,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
  };
}

export { cloudinary };

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

/**
 * Uploads a file buffer directly to Cloudinary via upload stream
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: "image" | "auto" | "raw" | "video";
    publicId?: string;
  } = {},
): Promise<CloudinaryUploadResult> {
  const base64 = buffer.toString("base64");
  const dataUri = `data:image/jpeg;base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: options.folder || "finergetics",
      resource_type: options.resourceType || "image",
      public_id: options.publicId,
    });

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
    };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Cloudinary upload failed";
    throw new Error(msg);
  }
}
