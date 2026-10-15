import { describe, expect, it, mock } from "bun:test";

mock.module("server-only", () => ({}));
mock.module("next/cache", () => ({
  cacheTag: () => {},
  cacheLife: () => {},
  revalidateTag: () => {},
  revalidatePath: () => {},
}));
process.env.__NEXT_USE_CACHE = "1";

import robots from "@/app/robots";
import { pageSectionsArraySchema } from "@/lib/schemas/sections";

describe("Phase 6 — Public Pages, Data Binding & Discovery", () => {
  it("generates valid robots.txt disallowing admin while allowing public pages", () => {
    const robotsConfig = robots();
    expect(robotsConfig.sitemap).toBe(
      "https://www.finergetics.com/sitemap.xml",
    );

    const rules = Array.isArray(robotsConfig.rules)
      ? robotsConfig.rules[0]
      : robotsConfig.rules;
    expect(rules.disallow).toContain("/admin/");
    expect(rules.disallow).toContain("/api/");
  });

  it("validates page sections schema parsing for all section types", () => {
    const sampleSections = [
      {
        type: "hero",
        id: "hero-test",
        enabled: true,
        data: {
          headline: "Helping businesses control risk",
          subheadline: "Independent energy advisory",
        },
      },
      {
        type: "marquee",
        id: "marquee-test",
        enabled: true,
        data: {
          items: ["Operators", "JV Partners"],
        },
      },
      {
        type: "intro",
        id: "intro-test",
        enabled: true,
        data: {
          title: "Firm Overview",
          narrative: "Our thesis",
        },
      },
      {
        type: "services",
        id: "services-test",
        enabled: true,
        data: {
          title: "Core Practices",
          description: "Practice description",
        },
      },
      {
        type: "process",
        id: "process-test",
        enabled: true,
        data: {
          title: "Methodology",
          steps: [
            {
              number: "01",
              title: "Diagnostic",
              subtitle: "Scoping",
              description: "Review",
            },
          ],
        },
      },
      {
        type: "why_us",
        id: "why-us-test",
        enabled: true,
        data: {
          title: "Why Us",
          pillars: [{ title: "Rigor", description: "Empirical proof" }],
        },
      },
      {
        type: "team",
        id: "team-test",
        enabled: true,
        data: {
          title: "Consultants",
        },
      },
      {
        type: "faq",
        id: "faq-test",
        enabled: true,
        data: {
          title: "FAQ",
          items: [{ question: "How does it work?", answer: "Structured" }],
        },
      },
      {
        type: "cta",
        id: "cta-test",
        enabled: true,
        data: {
          title: "Book a discussion",
          lead: "Lead",
        },
      },
    ];

    const parsed = pageSectionsArraySchema.safeParse(sampleSections);
    expect(parsed.success).toBe(true);
  });

  it("generates complete sitemap indexing all public pages, services, team, and posts", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(5);

    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://www.finergetics.com");
    expect(urls).toContain("https://www.finergetics.com/about");
    expect(urls).toContain("https://www.finergetics.com/services");
    expect(urls).toContain("https://www.finergetics.com/case-studies");
    expect(urls).toContain("https://www.finergetics.com/blog");
    expect(urls).toContain("https://www.finergetics.com/book-a-call");
    expect(urls).toContain("https://www.finergetics.com/privacy");
    expect(urls).toContain("https://www.finergetics.com/terms");
  });

  it("serves blog RSS 2.0 XML feed with valid channels and items", async () => {
    const { GET: getRss } = await import("@/app/blog/rss.xml/route");
    const res = await getRss();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/xml");

    const xml = await res.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<title>Finergetics");
    expect(xml).toContain("<link>https://www.finergetics.com/blog</link>");
  });

  it("serves root RSS 2.0 XML feed redirect", async () => {
    const { GET: getRootRss } = await import("@/app/rss.xml/route");
    const req = new Request("https://www.finergetics.com/rss.xml");
    const res = await getRootRss(req);
    expect(res.status).toBe(308);
  });
});
