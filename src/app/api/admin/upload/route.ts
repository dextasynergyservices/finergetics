import { type NextRequest, NextResponse } from "next/server";
import { recordAuditLog } from "@/server/audit/audit";
import { getCurrentSession, type UserRole } from "@/server/auth/guard";
import {
  ALLOWED_UPLOAD_FOLDERS,
  MAX_UPLOAD_BYTES,
  uploadBufferToCloudinary,
} from "@/server/cloudinary";
import { db } from "@/server/db/client";
import { mediaAssets } from "@/server/db/schema";
import { checkRateLimit } from "@/server/security/ratelimit";

export async function POST(req: NextRequest) {
  try {
    // 1. Authoritative session check
    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Editor session required." },
        { status: 401 },
      );
    }

    const userRole = (session.user as { role?: UserRole }).role ?? "editor";
    if (userRole !== "admin" && userRole !== "editor") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Insufficient privileges." },
        { status: 403 },
      );
    }

    const user = session.user;

    // 2. Rate limiting check
    const rateLimit = await checkRateLimit("upload_sign", user.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Upload rate limit exceeded. Please wait a few minutes before uploading again.",
        },
        { status: 429 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string) || "";
    const folder = (formData.get("folder") as string) || "finergetics";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was provided for upload." },
        { status: 400 },
      );
    }

    // 3. Folder allow-list verification
    const isFolderAllowed = ALLOWED_UPLOAD_FOLDERS.some(
      (allowed) => folder === allowed || folder.startsWith(`${allowed}/`),
    );
    if (!isFolderAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Folder '${folder}' is not allowed for uploads.`,
        },
        { status: 400 },
      );
    }

    // 4. SVG blocking (prevent stored XSS)
    if (
      file.type === "image/svg+xml" ||
      file.name.toLowerCase().endsWith(".svg")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "SVG uploads are disabled for security reasons. Please use WebP, PNG, or JPEG formats.",
        },
        { status: 400 },
      );
    }

    // 5. File size limits (≤ 10MB)
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the maximum limit of ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.`,
        },
        { status: 400 },
      );
    }

    // 6. MIME type validation
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only valid raster images (JPEG, PNG, WebP, AVIF) are supported.",
        },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await uploadBufferToCloudinary(buffer, {
      folder,
      resourceType: "image",
    });

    // Record asset in database
    const [asset] = await db
      .insert(mediaAssets)
      .values({
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        alt: alt.trim() || file.name,
        folder,
        uploadedBy: user.email,
      })
      .onConflictDoUpdate({
        target: mediaAssets.publicId,
        set: {
          width: uploadResult.width,
          height: uploadResult.height,
          bytes: uploadResult.bytes,
          format: uploadResult.format,
          alt: alt.trim() || file.name,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Log the action in security audit trail
    await recordAuditLog({
      userId: user.id,
      action: "media.upload",
      entity: "media_assets",
      entityId: asset?.id,
      summary: {
        publicId: uploadResult.publicId,
        fileName: file.name,
        bytes: uploadResult.bytes,
      },
    });

    return NextResponse.json({
      success: true,
      asset: {
        ...asset,
        secureUrl: uploadResult.secureUrl,
      },
    });
  } catch (err) {
    console.error("API /api/admin/upload error:", err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to upload image file.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
