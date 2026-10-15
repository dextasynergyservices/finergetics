export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=${width}`;
  }
  const q = quality ? `q_${quality}` : "q_auto";
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,${q},c_limit,w_${width}/${src}`;
}
