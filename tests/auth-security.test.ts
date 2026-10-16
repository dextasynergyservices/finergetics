import { describe, expect, it } from "bun:test";
import { NextRequest } from "next/server";
import { bookCallSchema, serviceInputSchema } from "../src/lib/schemas";
import { proxy } from "../src/proxy";

describe("Phase 4 Security Gate — Proxy & Auth Redirection", () => {
  it("blocks unauthenticated requests to bare /admin and redirects to /admin/login", () => {
    const req = new NextRequest("http://localhost:3000/admin", {
      headers: {
        host: "localhost:3000",
      },
    });

    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/admin/login",
    );
  });

  it("blocks unauthenticated requests to /admin/dashboard and redirects to /admin/login", () => {
    const req = new NextRequest("http://localhost:3000/admin/dashboard", {
      headers: {
        host: "localhost:3000",
      },
    });

    const res = proxy(req);
    expect(res.status).toBe(307); // NextResponse.redirect default status
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/admin/login",
    );
  });

  it("blocks unauthenticated requests to /admin/settings and redirects to /admin/login", () => {
    const req = new NextRequest("http://localhost:3000/admin/settings", {
      headers: {
        host: "localhost:3000",
      },
    });

    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/admin/login",
    );
  });

  it("permits access to /admin/login without redirection loop", () => {
    const req = new NextRequest("http://localhost:3000/admin/login", {
      headers: {
        host: "localhost:3000",
      },
    });

    const res = proxy(req);
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects authenticated requests from bare /admin to /admin/dashboard", () => {
    const req = new NextRequest("http://localhost:3000/admin", {
      headers: {
        host: "localhost:3000",
        cookie: "better-auth.session_token=test-valid-session-token-123456",
      },
    });

    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/admin/dashboard",
    );
  });

  it("permits access to /admin/dashboard when a valid better-auth session cookie is present", () => {
    const req = new NextRequest("http://localhost:3000/admin/dashboard", {
      headers: {
        host: "localhost:3000",
        cookie: "better-auth.session_token=test-valid-session-token-123456",
      },
    });

    const res = proxy(req);
    // When allowed, returns next() with 200 and no location header
    expect(res.headers.get("location")).toBeNull();
  });
});

describe("Phase 4 Security Gate — Data Validation & Input Sanitization", () => {
  it("rejects malicious or invalid slug in service input schema", () => {
    const invalidPayload = {
      slug: "invalid slug with spaces!",
      title: "Valid Title",
      summary: "This is a sufficiently long summary for testing.",
      status: "published",
    };

    const result = serviceInputSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("accepts strictly formatted kebab-case slug and validates service input", () => {
    const validPayload = {
      slug: "valid-kebab-slug",
      title: "Valid Title",
      summary: "This is a sufficiently long summary for testing.",
      status: "published",
    };

    const result = serviceInputSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("detects and rejects bot honeypot in book-a-call submissions", () => {
    const botPayload = {
      name: "Spam Bot",
      email: "bot@spam.com",
      websiteUrl: "http://spam-link.com", // Honeypot trap filled
      recaptchaToken: "sample-token",
    };

    const result = bookCallSchema.safeParse(botPayload);
    expect(result.success).toBe(false);
  });
});

describe("Role-Based Access Control (RBAC) & Privilege Separation", () => {
  it("strictly enforces requireAdmin() in all administrative page loaders", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const rootDir = process.cwd();

    const adminOnlyPages = [
      "src/app/admin/(panel)/users/page.tsx",
      "src/app/admin/(panel)/settings/page.tsx",
      "src/app/admin/(panel)/leads/page.tsx",
      "src/app/admin/(panel)/audit/page.tsx",
    ];

    for (const pagePath of adminOnlyPages) {
      const content = readFileSync(join(rootDir, pagePath), "utf8");
      expect(content).toContain("await requireAdmin()");
    }
  });

  it("strictly enforces requireAdmin() in all administrative data queries", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const rootDir = process.cwd();

    const adminQueriesContent = readFileSync(
      join(rootDir, "src/server/queries/admin.ts"),
      "utf8",
    );

    const normalizedContent = adminQueriesContent.replace(/\r\n/g, "\n");
    // Verify all admin-only queries call requireAdmin()
    expect(normalizedContent).toContain(
      "export async function getAdminUsers() {\n  await requireAdmin()",
    );
    expect(normalizedContent).toContain(
      "export async function getAdminLeads() {\n  await requireAdmin()",
    );
    expect(normalizedContent).toContain(
      "export async function getAdminAuditLogs(limit = 100) {\n  await requireAdmin()",
    );
    expect(normalizedContent).toContain(
      "export async function getAdminSiteSettings() {\n  await requireAdmin()",
    );
  });

  it("strictly enforces requireAdmin() in administrative server actions", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const rootDir = process.cwd();

    // User management actions
    const usersActionContent = readFileSync(
      join(rootDir, "src/server/actions/users.ts"),
      "utf8",
    );
    expect(usersActionContent).toContain("await requireAdmin()");

    // Settings actions
    const settingsActionContent = readFileSync(
      join(rootDir, "src/server/actions/settings.ts"),
      "utf8",
    );
    expect(settingsActionContent).toContain("await requireAdmin()");

    // Leads actions
    const leadsActionContent = readFileSync(
      join(rootDir, "src/server/actions/leads.ts"),
      "utf8",
    );
    expect(leadsActionContent).toContain("await requireAdmin()");

    // Revalidate all content action
    const revalidateActionContent = readFileSync(
      join(rootDir, "src/server/actions/revalidate.ts"),
      "utf8",
    );
    expect(revalidateActionContent).toContain("await requireAdmin()");
  });

  it("ensures navigation items hide admin-only routes (users, settings, leads, audit) from editor role", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const rootDir = process.cwd();

    const navContent = readFileSync(
      join(rootDir, "src/components/admin/admin-nav.tsx"),
      "utf8",
    );

    // Check that adminOnly: true is set on all 4 restricted routes
    expect(navContent).toMatch(
      /label:\s*"Leads & Enquiries"[\s\S]*?adminOnly:\s*true/,
    );
    expect(navContent).toMatch(
      /label:\s*"Site Settings"[\s\S]*?adminOnly:\s*true/,
    );
    expect(navContent).toMatch(
      /label:\s*"User Access"[\s\S]*?adminOnly:\s*true/,
    );
    expect(navContent).toMatch(/label:\s*"Audit Log"[\s\S]*?adminOnly:\s*true/);

    // Check that filtering condition role === "admin" is present
    expect(navContent).toContain('!item.adminOnly || role === "admin"');
  });

  it("ensures command palette hides admin-only routes from editor role", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const rootDir = process.cwd();

    const cmdContent = readFileSync(
      join(rootDir, "src/components/admin/command-palette.tsx"),
      "utf8",
    );

    expect(cmdContent).toMatch(/id:\s*"leads"[\s\S]*?adminOnly:\s*true/);
    expect(cmdContent).toMatch(/id:\s*"settings"[\s\S]*?adminOnly:\s*true/);
    expect(cmdContent).toMatch(/id:\s*"users"[\s\S]*?adminOnly:\s*true/);
    expect(cmdContent).toMatch(/id:\s*"audit"[\s\S]*?adminOnly:\s*true/);
    expect(cmdContent).toContain(
      'if (item.adminOnly && role !== "admin") return false;',
    );
  });

  it("ensures dashboard conditionally restricts inbound inquiries from editor role", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const rootDir = process.cwd();

    const dashboardContent = readFileSync(
      join(rootDir, "src/app/admin/(panel)/dashboard/page.tsx"),
      "utf8",
    );

    // Queries leads only if role === admin
    expect(dashboardContent).toContain('role === "admin"');
    // Renders leads section only if role === admin
    expect(dashboardContent).toContain('{role === "admin" && (');
  });
});
