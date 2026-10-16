import { type NextRequest, NextResponse } from "next/server";
import { getCurrentSession, type UserRole } from "@/server/auth/guard";
import {
  ALLOWED_IMAGE_FORMATS,
  ALLOWED_UPLOAD_FOLDERS,
  generateCloudinarySignature,
} from "@/server/cloudinary";
import { checkRateLimit } from "@/server/security/ratelimit";

export async function POST(req: NextRequest) {
  try {
    // 1. Authoritative session & role check: only authenticated editors/admins can sign uploads
    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized: Editor session required to sign uploads." },
        { status: 401 },
      );
    }

    const userRole = (session.user as { role?: UserRole }).role ?? "editor";
    if (userRole !== "admin" && userRole !== "editor") {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges." },
        { status: 403 },
      );
    }

    // 2. Abuse protection: rate limit signature generation per user (30 per 10 mins)
    const rateLimitResult = await checkRateLimit(
      "upload_sign",
      session.user.id,
    );
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error:
            "Upload rate limit exceeded. Please wait a few minutes before trying again.",
        },
        { status: 429 },
      );
    }

    const body = (await req.json()) as {
      paramsToSign?: Record<string, string | number>;
    };

    const params = body?.paramsToSign || {};

    // 3. Folder allow-list validation
    if (params.folder) {
      const folderStr = String(params.folder);
      const isAllowed = ALLOWED_UPLOAD_FOLDERS.some(
        (allowed) =>
          folderStr === allowed || folderStr.startsWith(`${allowed}/`),
      );
      if (!isAllowed) {
        return NextResponse.json(
          {
            error: `Target folder '${folderStr}' is not in the upload allow-list.`,
          },
          { status: 400 },
        );
      }
    }

    // 4. Format & SVG restriction
    if (params.format) {
      const formatStr = String(params.format).toLowerCase();
      if (formatStr === "svg" || formatStr === "image/svg+xml") {
        return NextResponse.json(
          { error: "SVG uploads are disabled for security reasons." },
          { status: 400 },
        );
      }
      if (
        !ALLOWED_IMAGE_FORMATS.includes(
          formatStr as (typeof ALLOWED_IMAGE_FORMATS)[number],
        )
      ) {
        return NextResponse.json(
          { error: `Image format '${formatStr}' is not supported.` },
          { status: 400 },
        );
      }
    }

    if (params.allowed_formats) {
      const formats = String(params.allowed_formats).toLowerCase();
      if (formats.includes("svg")) {
        return NextResponse.json(
          { error: "SVG uploads are disabled for security reasons." },
          { status: 400 },
        );
      }
    }

    const signResult = generateCloudinarySignature(params);

    return NextResponse.json(signResult);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to sign Cloudinary upload params";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
