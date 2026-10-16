import type { ImageRef } from "./schemas/common";

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "scale" | "thumb";
  gravity?: string;
  quality?: number | "auto";
  format?: "auto" | "webp" | "avif" | "png" | "jpg";
  blur?: number;
}

/**
 * Builds a direct Cloudinary delivery URL with optimal compression and format (browser & client safe)
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {},
): string {
  if (!publicId) return "";
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    return publicId;
  }

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djyarsuk6";
  const transforms: string[] = ["f_auto", "q_auto"];

  if (options.gravity) {
    transforms.push(`g_${options.gravity}`);
  }

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.quality && options.quality !== "auto") {
    transforms.push(`q_${options.quality}`);
  }
  if (options.format && options.format !== "auto") {
    transforms.push(`f_${options.format}`);
  }
  if (options.blur) transforms.push(`e_blur:${options.blur}`);

  const transformString = transforms.join(",");
  const cleanId = publicId.replace(/^\//, "");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${cleanId}`;
}

/**
 * Builds a tiny blurred base placeholder URL for progressive image loading
 */
export function getCloudinaryBlurUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 32,
    quality: 20,
    blur: 1000,
    format: "auto",
  });
}

export type { ImageRef };
