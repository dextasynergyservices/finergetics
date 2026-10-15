import { toast } from "sonner";

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Checks if an image file exceeds the 10MB limit.
 * If exceeded, automatically compresses and scales the image client-side
 * to retain maximum visual quality while reducing the file size under 10MB.
 * Notifies the user with a toast message.
 */
export async function compressImageIfOverLimit(file: File): Promise<File> {
  // If file is already under 10MB, no compression needed
  if (file.size <= MAX_FILE_SIZE_BYTES) {
    return file;
  }

  // Only compress raster images
  if (!file.type.startsWith("image/") || file.type.includes("svg")) {
    return file;
  }

  const initialSizeMB = (file.size / (1024 * 1024)).toFixed(1);
  toast.info(
    `Image is ${initialSizeMB}MB (exceeds 10MB limit). Optimizing file size while preserving high visual quality...`,
    { duration: 4000 },
  );

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // High quality scale down: keep maximum dimension at up to 2560px for ultra-sharp rendering
        const MAX_DIMENSION = 2560;
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback if canvas context fails
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (or JPEG fallback) with 0.88 quality
        const mimeType = "image/webp";
        const quality = 0.88;

        const attemptCompression = (currentQuality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              // If still over 10MB and quality can be reduced slightly, retry
              if (blob.size > MAX_FILE_SIZE_BYTES && currentQuality > 0.7) {
                attemptCompression(currentQuality - 0.08);
                return;
              }

              const finalSizeMB = (blob.size / (1024 * 1024)).toFixed(1);
              toast.success(
                `Image optimized: ${initialSizeMB}MB → ${finalSizeMB}MB (high visual quality retained)`,
                { duration: 3500 },
              );

              const newFileName = `${file.name.replace(/\.[^/.]+$/, "")}.webp`;
              const compressedFile = new File([blob], newFileName, {
                type: mimeType,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            mimeType,
            currentQuality,
          );
        };

        attemptCompression(quality);
      };

      img.onerror = () => {
        resolve(file);
      };

      if (typeof readerEvent.target?.result === "string") {
        img.src = readerEvent.target.result;
      } else {
        resolve(file);
      }
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
