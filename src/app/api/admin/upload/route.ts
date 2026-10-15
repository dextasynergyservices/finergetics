import { type NextRequest, NextResponse } from "next/server";
import { recordAuditLog } from "@/server/audit/audit";
import { requireRole } from "@/server/auth/guard";
import { uploadBufferToCloudinary } from "@/server/cloudinary";
import { db } from "@/server/db/client";
import { mediaAssets } from "@/server/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireRole("editor");

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

    // Safety check on mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Only image files (JPEG, PNG, WebP, SVG, AVIF) are supported.",
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
    const message =
      err instanceof Error ? err.message : "Failed to upload image file.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
