import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/server/queries/posts";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.finergetics.com";

export async function GET() {
  const posts = await getPublishedPosts({ limit: 50 });

  const itemsXml = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.categoryName ? `<category>${post.categoryName}</category>` : ""}
      ${post.authorName ? `<author>${post.authorName}</author>` : ""}
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Finergetics Consulting Limited — Insights &amp; Advisory Perspectives</title>
    <link>${SITE_URL}/blog</link>
    <description>Executive analysis, petroleum fiscal regime updates, and joint venture accounting perspectives.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
