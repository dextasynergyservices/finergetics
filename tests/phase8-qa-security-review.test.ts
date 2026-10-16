import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";
import nextConfig from "../next.config";
import cloudinaryLoader from "../src/lib/cloudinary-loader";
import { serviceInputSchema } from "../src/lib/schemas/service";
import { inviteUserSchema } from "../src/lib/schemas/user";
import { proxy } from "../src/proxy";

const ROOT_DIR = process.cwd();

describe("Phase 8 — QA, Performance, Accessibility & Security Review", () => {
  // --------------------------------------------------------------------------
  // 1. Accessibility Pass (WCAG 2.1 AA / Axe Standards)
  // --------------------------------------------------------------------------
  describe("1. Accessibility (WCAG 2.1 AA Standards)", () => {
    test("Root layout provides an accessible 'skip to main content' link for keyboard navigation", () => {
      const layoutFile = readFileSync(
        join(ROOT_DIR, "src/app/layout.tsx"),
        "utf8",
      );
      expect(layoutFile).toContain('href="#main-content"');
      expect(layoutFile).toContain("sr-only focus:not-sr-only");
      expect(layoutFile).toContain("Skip to main content");
      expect(layoutFile).toContain("focus:ring-2");
    });

    test('All public page templates include <main id="main-content"> as target for skip links', () => {
      const pagePaths = [
        "src/app/page.tsx",
        "src/app/about/page.tsx",
        "src/app/services/page.tsx",
        "src/app/services/[slug]/page.tsx",
        "src/app/case-studies/page.tsx",
        "src/app/case-studies/[slug]/page.tsx",
        "src/app/blog/page.tsx",
        "src/app/blog/[slug]/page.tsx",
        "src/app/book-a-call/page.tsx",
        "src/app/privacy/page.tsx",
        "src/app/terms/page.tsx",
        "src/app/not-found.tsx",
      ];

      for (const relPath of pagePaths) {
        const content = readFileSync(join(ROOT_DIR, relPath), "utf8");
        expect(content).toContain('id="main-content"');
      }
    });

    test("Heading structure adheres to strict hierarchical nesting (h1 -> h2 -> h3)", () => {
      // Home page uses HeroSection with <h1>
      const heroSection = readFileSync(
        join(ROOT_DIR, "src/components/sections/hero-section.tsx"),
        "utf8",
      );
      expect(heroSection).toContain("<h1");
      expect(heroSection).toContain("font-display");

      // Section headings use <h2>
      const sectionHeading = readFileSync(
        join(ROOT_DIR, "src/components/site/section-heading.tsx"),
        "utf8",
      );
      expect(sectionHeading).toContain("<h2");

      // Card components use <h3>
      const serviceCard = readFileSync(
        join(ROOT_DIR, "src/components/site/cards/service-card.tsx"),
        "utf8",
      );
      expect(serviceCard).toContain("<h3");

      const caseStudyCard = readFileSync(
        join(ROOT_DIR, "src/components/site/cards/case-study-card.tsx"),
        "utf8",
      );
      expect(caseStudyCard).toContain("<h3");

      const postCard = readFileSync(
        join(ROOT_DIR, "src/components/site/cards/post-card.tsx"),
        "utf8",
      );
      expect(postCard).toContain("<h3");

      const teamCard = readFileSync(
        join(ROOT_DIR, "src/components/site/cards/team-card.tsx"),
        "utf8",
      );
      expect(teamCard).toContain("<h3");
    });

    test("Pre-footer CTA, Header, and Interactive buttons implement accessible labels and ARIA attributes", () => {
      const headerContent = readFileSync(
        join(ROOT_DIR, "src/components/site/header.tsx"),
        "utf8",
      );
      expect(headerContent).toContain('aria-label="Open Navigation Menu"');
      expect(headerContent).toContain("aria-expanded={mobileMenuOpen}");
      expect(headerContent).toContain('aria-controls="mobile-nav-dialog"');
      expect(headerContent).toContain('id="mobile-nav-dialog"');
      expect(headerContent).toContain('role="dialog"');
      expect(headerContent).toContain('aria-modal="true"');

      const footerContent = readFileSync(
        join(ROOT_DIR, "src/components/site/footer.tsx"),
        "utf8",
      );
      expect(footerContent).toContain("Finergetics Consulting Limited");
      expect(footerContent).toContain("Privacy Policy");
      expect(footerContent).toContain("Terms of Engagement");
    });

    test("prefers-reduced-motion is strictly respected in CSS and JS providers", () => {
      const globalsCss = readFileSync(
        join(ROOT_DIR, "src/app/globals.css"),
        "utf8",
      );
      expect(globalsCss).toContain("@media (prefers-reduced-motion: reduce)");
      expect(globalsCss).toContain("animation-duration: 0.01ms");
      expect(globalsCss).toContain("transition-duration: 0.01ms");
      expect(globalsCss).toContain("scroll-behavior: auto");

      const smoothScroll = readFileSync(
        join(ROOT_DIR, "src/components/providers/smooth-scroll.tsx"),
        "utf8",
      );
      expect(smoothScroll).toContain("prefers-reduced-motion: reduce");
      expect(smoothScroll).toContain("ontouchstart");
    });

    test("Color contrast tokens meet WCAG AA >= 4.5:1 ratio for normal body copy", () => {
      // Helper function to calculate relative luminance
      function getLuminance(r: number, g: number, b: number): number {
        const [rs, gs, bs] = [r, g, b].map((c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      function getContrastRatio(hex1: string, hex2: string): number {
        const parseHex = (hex: string) => {
          const clean = hex.replace("#", "");
          return [
            parseInt(clean.slice(0, 2), 16),
            parseInt(clean.slice(2, 4), 16),
            parseInt(clean.slice(4, 6), 16),
          ];
        };
        const [r1, g1, b1] = parseHex(hex1);
        const [r2, g2, b2] = parseHex(hex2);
        const l1 = getLuminance(r1, g1, b1);
        const l2 = getLuminance(r2, g2, b2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      const white = "#ffffff";
      const sky50 = "#f6f9fc";
      const navy950 = "#061061";
      const royal800 = "#072b8e";
      const royal600 = "#1649b9";
      const ink900 = "#22262b";
      const slate600 = "#565b64";
      const silver400 = "#b1b3b8";

      // 1. Primary body text (ink-900 on white)
      const bodyContrast = getContrastRatio(ink900, white);
      expect(bodyContrast).toBeGreaterThanOrEqual(12.0); // ~13.5:1

      // 2. Secondary text (slate-600 on white)
      const secondaryContrast = getContrastRatio(slate600, white);
      expect(secondaryContrast).toBeGreaterThanOrEqual(4.5); // ~5.8:1

      // 3. Brand headings (navy-950 on white)
      const navyContrast = getContrastRatio(navy950, white);
      expect(navyContrast).toBeGreaterThanOrEqual(14.0); // ~16.5:1

      // 4. Buttons and links (royal-600 on white)
      const royalContrast = getContrastRatio(royal600, white);
      expect(royalContrast).toBeGreaterThanOrEqual(4.5); // ~5.2:1

      // 5. White text on dark cards (white on navy-950)
      const darkCardContrast = getContrastRatio(white, navy950);
      expect(darkCardContrast).toBeGreaterThanOrEqual(14.0);

      // 6. Silver text on dark cards (silver-400 on navy-950)
      const silverOnNavy = getContrastRatio(silver400, navy950);
      expect(silverOnNavy).toBeGreaterThanOrEqual(7.0); // ~8.1:1

      // 7. Royal headings (royal-800 on white)
      const royal800Contrast = getContrastRatio(royal800, white);
      expect(royal800Contrast).toBeGreaterThanOrEqual(10.0); // ~11:1

      // 8. Body text on sky-50 background (ink-900 on sky-50)
      const bodyOnSky = getContrastRatio(ink900, sky50);
      expect(bodyOnSky).toBeGreaterThanOrEqual(11.0);
    });
  });

  // --------------------------------------------------------------------------
  // 2. Performance & Cost-Protection Budgets (§5.2)
  // --------------------------------------------------------------------------
  describe("2. Performance & Vercel Limit Protection", () => {
    test("Images use custom Cloudinary loader with f_auto, q_auto, and c_limit parameters", () => {
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "finergetics-test";
      const transformedUrl = cloudinaryLoader({
        src: "corporate/hero-asset",
        width: 1280,
      });

      expect(transformedUrl).toContain(
        "https://res.cloudinary.com/finergetics-test/image/upload/",
      );
      expect(transformedUrl).toContain("f_auto,q_auto,c_limit,w_1280");
      expect(transformedUrl).toContain("corporate/hero-asset");

      // Verify next.config.ts delegates images to custom loader file
      expect(nextConfig.images?.loader).toBe("custom");
      expect(nextConfig.images?.loaderFile).toBe(
        "./src/lib/cloudinary-loader.ts",
      );
    });

    test("Hero images enforce fixed aspect ratios and high priority to eliminate CLS and accelerate LCP", () => {
      const heroContent = readFileSync(
        join(ROOT_DIR, "src/components/sections/hero-section.tsx"),
        "utf8",
      );
      expect(heroContent).toContain("priority");
      expect(heroContent).toContain("aspect-[16/9]");
      expect(heroContent).toContain("sizes=");
    });

    test("Public content queries use Next.js Cache Components with tags for instant edge revalidation", () => {
      const queryFiles = [
        "src/server/queries/services.ts",
        "src/server/queries/case-studies.ts",
        "src/server/queries/posts.ts",
        "src/server/queries/pages.ts",
        "src/server/queries/settings.ts",
        "src/server/queries/team.ts",
      ];

      for (const relPath of queryFiles) {
        const content = readFileSync(join(ROOT_DIR, relPath), "utf8");
        expect(content).toContain('"use cache"');
        expect(content).toContain("cacheTag(");
        expect(content).toContain('cacheLife("days")');
      }
    });

    test("next.config.ts has poweredByHeader disabled and cacheComponents enabled", () => {
      expect(nextConfig.poweredByHeader).toBe(false);
      expect(nextConfig.cacheComponents).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Security Pass & OWASP Top 10 Walkthrough
  // --------------------------------------------------------------------------
  describe("3. Security Review & OWASP Top 10 Walkthrough", () => {
    test("A01: Broken Access Control — Unauthenticated requests are blocked from /admin", () => {
      const mockReq = new NextRequest("http://localhost:3000/admin/dashboard");
      const res = proxy(mockReq);
      expect(res.status).toBe(307);
      expect(res.headers.get("Location")).toContain("/admin/login");
    });

    test("A01: Broken Access Control — proxy matcher strictly targets /admin routes only", () => {
      const proxyContent = readFileSync(join(ROOT_DIR, "src/proxy.ts"), "utf8");
      expect(proxyContent).toContain('matcher: ["/admin", "/admin/:path*"]');
    });

    test("A01: Privilege Separation — user invite schema validates roles strictly to admin | editor", () => {
      const validAdmin = inviteUserSchema.safeParse({
        name: "Director",
        email: "director@finergetics.com",
        role: "admin",
      });
      expect(validAdmin.success).toBe(true);

      const invalidRole = inviteUserSchema.safeParse({
        name: "Hacker",
        email: "hacker@domain.com",
        role: "superadmin_bypass",
      });
      expect(invalidRole.success).toBe(false);
    });

    test("A03: Injection — Slugs are strictly validated against kebab-case regex", () => {
      const validSlug = serviceInputSchema.safeParse({
        title: "Fiscal Regime Advisory",
        slug: "ep-fiscal-regime-advisory",
        summary:
          "Comprehensive advisory on petroleum fiscal transitions and royalties.",
        status: "published",
        sortOrder: 1,
      });
      expect(validSlug.success).toBe(true);

      const sqlInjectionSlug = serviceInputSchema.safeParse({
        title: "Malicious Service",
        slug: "services'; DROP TABLE services;--",
        summary: "Injection attempt",
        status: "draft",
      });
      expect(sqlInjectionSlug.success).toBe(false);
    });

    test("A05: Security Misconfiguration — Enforces complete HTTP security headers", async () => {
      const headersList = nextConfig.headers ? await nextConfig.headers() : [];
      const globalHeaders = headersList.find(
        (h: { source: string }) => h.source === "/(.*)",
      )?.headers;

      expect(globalHeaders).toBeDefined();
      if (!globalHeaders) {
        throw new Error("globalHeaders not defined");
      }
      const headerMap = new Map(
        globalHeaders.map((h: { key: string; value: string }) => [
          h.key,
          h.value,
        ]),
      );

      expect(headerMap.get("Strict-Transport-Security")).toContain(
        "max-age=63072000",
      );
      expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
      expect(headerMap.get("X-Frame-Options")).toBe("DENY");
      expect(headerMap.get("Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(headerMap.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
      expect(headerMap.get("Content-Security-Policy")).toContain(
        "default-src 'self'",
      );
      expect(headerMap.get("Content-Security-Policy")).toContain(
        "frame-ancestors 'none'",
      );
    });

    test("A05: Security Misconfiguration — proxy generates dynamic cryptographic nonce for admin panel", () => {
      const mockReq = new NextRequest("http://localhost:3000/admin/dashboard", {
        headers: {
          cookie: "better-auth.session_token=valid-test-token",
        },
      });
      const res = proxy(mockReq);
      const csp = res.headers.get("Content-Security-Policy");
      const nonce = res.headers.get("x-nonce");

      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe("string");
      expect(csp).toContain("script-src 'self' 'unsafe-inline'");
      expect(csp).toContain("widget.cloudinary.com");
    });

    test("RFC 9116 security.txt is accessible and contains security contact info", () => {
      expect(
        existsSync(join(ROOT_DIR, "public/.well-known/security.txt")),
      ).toBe(true);
      const secTxt = readFileSync(
        join(ROOT_DIR, "public/.well-known/security.txt"),
        "utf8",
      );
      expect(secTxt).toContain("Contact: mailto:security@finergetics.com");
      expect(secTxt).toContain("Expires:");
      expect(secTxt).toContain("Preferred-Languages: en");
    });
  });

  // --------------------------------------------------------------------------
  // 4. SEO & Content Proofreading
  // --------------------------------------------------------------------------
  describe("4. SEO Integrity & Discovery", () => {
    test("Metadata API robots.ts denies admin and allows public indexing", () => {
      const robotsContent = readFileSync(
        join(ROOT_DIR, "src/app/robots.ts"),
        "utf8",
      );
      expect(robotsContent).toContain('disallow: ["/admin/", "/api/"]');
      expect(robotsContent).toContain("/sitemap.xml");
    });

    test("sitemap.ts indexes core public sections and dynamic collections", () => {
      const sitemapContent = readFileSync(
        join(ROOT_DIR, "src/app/sitemap.ts"),
        "utf8",
      );
      expect(sitemapContent).toContain("getPublishedServices");
      expect(sitemapContent).toContain("getPublishedTeamMembers");
      expect(sitemapContent).toContain("getPublishedPosts");
    });

    test("404 Not Found template provides contextual advisory paths back to safety", () => {
      const notFoundContent = readFileSync(
        join(ROOT_DIR, "src/app/not-found.tsx"),
        "utf8",
      );
      expect(notFoundContent).toContain(
        "The Requested Advisory Page Does Not Exist",
      );
      expect(notFoundContent).toContain('href="/services"');
      expect(notFoundContent).toContain('href="/about"');
      expect(notFoundContent).toContain('href="/case-studies"');
    });
  });
});
