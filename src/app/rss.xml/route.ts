import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL("/blog/rss.xml", request.url);
  return NextResponse.redirect(url, 308);
}
