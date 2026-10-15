import { type NextRequest, NextResponse } from "next/server";
import { generateCloudinarySignature } from "@/server/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      paramsToSign?: Record<string, string | number>;
    };

    const params = body?.paramsToSign || {};
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
