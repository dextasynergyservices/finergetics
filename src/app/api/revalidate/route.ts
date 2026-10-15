import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import {
  type ContentTag,
  revalidateContent,
} from "@/server/actions/revalidate";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const tag = searchParams.get("tag");

  if (!secret || secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json(
      { error: "Query parameter 'tag' is required" },
      { status: 400 },
    );
  }

  await revalidateContent(tag as ContentTag);

  return NextResponse.json({
    revalidated: true,
    tag,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { secret?: string; tags?: string[] };

    if (!body.secret || body.secret !== env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const tags = body.tags || [];
    if (tags.length === 0) {
      return NextResponse.json(
        { error: "At least one tag is required" },
        { status: 400 },
      );
    }

    await revalidateContent(tags as ContentTag[]);

    return NextResponse.json({
      revalidated: true,
      tags,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Revalidation failed" },
      { status: 500 },
    );
  }
}
