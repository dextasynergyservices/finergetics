import { describe, expect, it, mock } from "bun:test";

mock.module("server-only", () => ({}));

import {
  caseStudyInputSchema,
  pageInputSchema,
  serviceInputSchema,
  teamMemberInputSchema,
} from "@/lib/schemas";
import { formatZodIssues } from "@/lib/schemas/common";

/**
 * Regression: editing a record whose nullable JSONB/text columns are NULL in
 * Postgres failed with "Invalid input: expected record, received null".
 * Every admin input schema must accept a row exactly as it comes from the DB.
 */
describe("Admin edit forms accept DB NULLs", () => {
  it("service with null body / tagline / icon / seo fields", () => {
    const res = serviceInputSchema.safeParse({
      slug: "financial-control-advisory",
      title: "Financial Control & Advisory Services",
      summary: "Independent financial control reviews for JV partners.",
      body: null,
      tagline: null,
      icon: null,
      image: null,
      seoTitle: null,
      seoDescription: null,
      status: "published",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.body).toBeNull();
      expect(res.data.tagline).toBeUndefined();
    }
  });

  it("case study with null challenge / approach / outcome", () => {
    const res = caseStudyInputSchema.safeParse({
      slug: "jv-audit",
      title: "JV Audit",
      summary: "A summary that is long enough.",
      challenge: null,
      approach: null,
      outcome: null,
      clientName: null,
      industry: null,
      cover: null,
    });
    expect(res.success).toBe(true);
  });

  it("team member with null bio / credentials", () => {
    const res = teamMemberInputSchema.safeParse({
      slug: "jane-doe",
      name: "Jane Doe",
      role: "Partner",
      bio: null,
      credentials: null,
      photo: null,
    });
    expect(res.success).toBe(true);
  });

  it("page with null seo fields", () => {
    const res = pageInputSchema.safeParse({
      key: "home",
      title: "Home",
      seoTitle: null,
      seoDescription: null,
      ogImage: null,
    });
    expect(res.success).toBe(true);
  });

  it("still rejects a non-object rich-text body", () => {
    const res = serviceInputSchema.safeParse({
      slug: "x-service",
      title: "Some service",
      summary: "A summary that is long enough.",
      body: "not a document",
    });
    expect(res.success).toBe(false);
  });
});

describe("Admin error messages are actionable", () => {
  it("names the field that failed validation", () => {
    const res = serviceInputSchema.safeParse({
      slug: "ok-slug",
      title: "Valid title",
      summary: "short",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(formatZodIssues(res.error.issues)).toStartWith("Summary:");
    }
  });

  it("maps a duplicate slug DB error (wrapped by Drizzle) to a clear message", async () => {
    const { describeDbError } = await import("@/server/db/errors");
    const driverErr = { code: "23505", constraint: "services_slug_uq" };
    const wrapped = Object.assign(new Error("Failed query"), {
      cause: driverErr,
    });
    expect(describeDbError(wrapped, "service")).toContain("URL slug");
  });
});
