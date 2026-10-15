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
