import { describe, expect, it } from "bun:test";
import {
  caseStudyInputSchema,
  leadStatusSchema,
  pageInputSchema,
  postCategoryInputSchema,
  postInputSchema,
  serviceInputSchema,
  teamMemberInputSchema,
} from "@/lib/schemas";
import { siteSettingsDataSchema } from "@/lib/schemas/settings";

describe("Phase 5 Admin Modules — Schemas & Data Contracts", () => {
  it("validates site settings schema with complete navigation and social links", () => {
    const validSettings = {
      general: {
        siteName: "Finergetics Consulting Limited",
        tagline: "Consulting Limited",
        brandLine:
          "Helping businesses control risk, improve performance, and increase value.",
        missionStatement:
          "We help organisations strengthen financial controls.",
        defaultSeoTitle: "Finergetics Consulting Limited",
        defaultSeoDescription:
          "High-stakes energy economics and fiscal governance.",
      },
      contact: {
        email: "info@finergetics.com",
        phone1: "+234 803 754 1083",
        phone2: "+234 810 040 3013",
        businessHours: "Mon – Fri: 8:00 AM – 6:00 PM",
        address: "Lagos, Nigeria",
      },
      social: {
        linkedin: "https://linkedin.com/company/finergetics",
        twitter: "https://twitter.com/finergetics",
      },
      navigation: {
        header: [
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
        footerSections: [
          {
            title: "Advisory",
            links: [
              {
                label: "Financial Control",
                href: "/services/financial-control",
              },
            ],
          },
        ],
      },
      security: {
        recaptchaThreshold: 50,
      },
    };

    const parsed = siteSettingsDataSchema.safeParse(validSettings);
    expect(parsed.success).toBe(true);
  });

  it("validates team member schema with ordering and custom photo", () => {
    const validMember = {
      slug: "babatunde-fashola",
      name: "Babatunde Fashola",
      role: "Lead Partner, Fiscal Economics",
      credentials: "FCA, MSc Energy Economics",
      highlights: [
        "Former Special Advisor on Petroleum Fiscal Terms",
        "Led 15+ JV Audits",
      ],
      photo: {
        publicId: "finergetics/team/babatunde-fashola",
        width: 800,
        height: 1000,
        alt: "Babatunde Fashola",
      },
      linkedinUrl: "https://linkedin.com/in/bfashola",
      sortOrder: 1,
      status: "published" as const,
    };

    const parsed = teamMemberInputSchema.safeParse(validMember);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.sortOrder).toBe(1);
      expect(parsed.data.photo?.publicId).toBe(
        "finergetics/team/babatunde-fashola",
      );
    }
  });

  it("validates service schema with tone and sortOrder", () => {
    const validService = {
      slug: "financial-control-reviews",
      title: "Financial Control Reviews",
      tagline: "Rigorous assurance across upstream joint ventures",
      summary:
        "Independent audit and cost verification ensuring complete contractual compliance.",
      icon: "ShieldCheck",
      cardTone: "royal" as const,
      sortOrder: 2,
      status: "published" as const,
    };

    const parsed = serviceInputSchema.safeParse(validService);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.cardTone).toBe("royal");
      expect(parsed.data.sortOrder).toBe(2);
    }
  });

  it("validates case study schema with quantifiable metrics", () => {
    const validCase = {
      slug: "offshore-jv-cost-recovery",
      title: "Deepwater Joint Venture Cost Recovery Audit",
      clientName: "Multinational E&P Operator",
      industry: "Upstream Oil & Gas",
      summary:
        "Uncovered $42M in non-recoverable operational costs across three deepwater blocks.",
      metrics: [
        { label: "Cost Disallowance Recovered", value: "$42.4M" },
        { label: "Cycle Time Reduction", value: "35%" },
      ],
      featured: true,
      status: "published" as const,
    };

    const parsed = caseStudyInputSchema.safeParse(validCase);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.metrics.length).toBe(2);
      expect(parsed.data.featured).toBe(true);
    }
  });

  it("validates blog post schema with draft/scheduled/published statuses", () => {
    const validPost = {
      slug: "pia-fiscal-terms-analysis",
      title: "Navigating Fiscal Terms under the Petroleum Industry Act",
      excerpt:
        "A tactical guide for operators calculating hydrocarbon tax and royalty adjustments.",
      body: {
        type: "doc",
        content: [{ type: "paragraph", text: "Deep dive analysis..." }],
      },
      readingMinutes: 7,
      status: "published" as const,
    };

    const parsed = postInputSchema.safeParse(validPost);
    expect(parsed.success).toBe(true);

    const scheduled = postInputSchema.safeParse({
      ...validPost,
      status: "draft" as const,
      publishedAt: new Date(Date.now() + 86400000),
    });
    expect(scheduled.success).toBe(true);

    const categoryParsed = postCategoryInputSchema.safeParse({
      slug: "fiscal-regimes",
      name: "Fiscal Regimes",
    });
    expect(categoryParsed.success).toBe(true);
  });

  it("validates pages & sections schema with multiple typed sections", () => {
    const validPage = {
      key: "home" as const,
      title: "Home",
      seoTitle: "Finergetics Consulting Limited",
      seoDescription: "Risk, Performance & Value in Energy & Infrastructure.",
      sections: [
        {
          id: "hero-1",
          type: "hero",
          enabled: true,
          data: {
            headline: "Clarity in Complex Energy Markets",
            subheadline: "Independent fiscal, risk, and financial consulting.",
            ctaPrimaryText: "Explore Advisory",
            ctaPrimaryLink: "/services",
          },
        },
        {
          id: "marquee-2",
          type: "marquee",
          enabled: true,
          data: {
            label: "Advisory Capabilities",
            items: [
              "Financial Control Reviews",
              "Fiscal Regime Advisory",
              "Commercial Optimization",
            ],
            speed: 35,
          },
        },
      ],
      status: "published" as const,
    };

    const parsed = pageInputSchema.safeParse(validPage);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.sections.length).toBe(2);
      expect(parsed.data.sections[0].type).toBe("hero");
    }
  });

  it("validates leads status transitions and pipeline stages", () => {
    const statuses = ["new", "contacted", "qualified", "closed", "spam"];
    for (const st of statuses) {
      expect(leadStatusSchema.safeParse(st).success).toBe(true);
    }
    expect(leadStatusSchema.safeParse("invalid_status").success).toBe(false);
  });
});
