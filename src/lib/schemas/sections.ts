import { z } from "zod";
import { imageRefSchema } from "./common";

// 1. Hero Section
export const heroSectionSchema = z.object({
  type: z.literal("hero"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    eyebrow: z.string().optional(),
    headline: z.string().min(1, "Headline is required"),
    highlightedText: z.string().nullable().optional(),
    subheadline: z.string().min(1, "Subheadline is required"),
    ctaPrimaryText: z.string().default("Book an Advisory Discussion"),
    ctaPrimaryLink: z.string().default("/book-a-call"),
    ctaSecondaryText: z.string().optional(),
    ctaSecondaryLink: z.string().optional(),
    image: imageRefSchema.nullable().optional(),
    backgroundImage: imageRefSchema.nullable().optional(),
  }),
});
export type HeroSection = z.infer<typeof heroSectionSchema>;

// 2. Marquee Section
export const marqueeSectionSchema = z.object({
  type: z.literal("marquee"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    label: z.string().optional(),
    items: z.array(z.string()).min(1, "At least one marquee item is required"),
    speed: z.coerce.number().int().positive().default(35),
  }),
});
export type MarqueeSection = z.infer<typeof marqueeSectionSchema>;

// 3. Intro / Value Proposition Section
export const introSectionSchema = z.object({
  type: z.literal("intro"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    eyebrow: z.string().default("• WHAT WE DO"),
    title: z.string().min(1, "Title is required"),
    highlight: z.string().optional(),
    narrative: z.string().min(1, "Narrative copy is required"),
    bullets: z.array(z.string()).optional(),
  }),
});
export type IntroSection = z.infer<typeof introSectionSchema>;

// 4. Core Services Section
export const servicesSectionSchema = z.object({
  type: z.literal("services"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    eyebrow: z.string().default("• OUR CORE SERVICES"),
    title: z.string().default("Specialised Financial &"),
    highlight: z.string().default("Commercial Advisory"),
    description: z
      .string()
      .default(
        "Four dedicated advisory practices engineered to control risk, optimize commercial decisions, and improve corporate performance.",
      ),
    serviceIds: z.array(z.string()).optional(), // optional manual filter/ordering
  }),
});
export type ServicesSection = z.infer<typeof servicesSectionSchema>;

// 5. Sticky-Stack Process Section ("How We Work")
export const processStepSchema = z.object({
  number: z.string(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  deliverables: z.array(z.string()).optional(),
  takeaway: z.string().optional(),
  tone: z.enum(["royal", "charcoal", "navy", "slate"]).default("royal"),
});
export type ProcessStep = z.infer<typeof processStepSchema>;

export const processSectionSchema = z.object({
  type: z.literal("process"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    eyebrow: z.string().default("• ADVISORY METHODOLOGY"),
    title: z.string().default("Structured Two-Column"),
    highlight: z.string().default("Engagement Process"),
    description: z
      .string()
      .default(
        "Our battle-tested advisory roadmap delivers rigorous evidence, strategic clarity, and sustainable governance.",
      ),
    steps: z.array(processStepSchema).min(1),
  }),
});
export type ProcessSection = z.infer<typeof processSectionSchema>;

// 6. Why Choose Us (3 Pillars)
export const pillarSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
});

export const whyUsSectionSchema = z.object({
  type: z.literal("why_us"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    eyebrow: z.string().default("• WHY CHOOSE US"),
    title: z.string().default("Proven Expertise &"),
    highlight: z.string().default("Institutional Rigor"),
    description: z
      .string()
      .default(
        "Three distinct reasons leading energy operators, JV partners, and investors trust Finergetics with mission-critical financial mandates.",
      ),
    pillars: z.array(pillarSchema).min(1),
  }),
});
export type WhyUsSection = z.infer<typeof whyUsSectionSchema>;

// 7. Team Showcase Section
export const teamSectionSchema = z.object({
  type: z.literal("team"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    eyebrow: z.string().default("• PRINCIPAL CONSULTANTS"),
    title: z.string().default("Led by Experienced"),
    highlight: z.string().default("Industry Practitioners"),
    description: z
      .string()
      .default(
        "Our principals bring over 30 years of direct banking, oil & gas finance, and joint venture governance leadership.",
      ),
    memberIds: z.array(z.string()).optional(),
  }),
});
export type TeamSection = z.infer<typeof teamSectionSchema>;

// 8. FAQ Accordion Section
export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const faqSectionSchema = z.object({
  type: z.literal("faq"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    eyebrow: z.string().default("• FREQUENTLY ASKED QUESTIONS"),
    title: z.string().default("Common Client"),
    highlight: z.string().default("Inquiries & Details"),
    description: z
      .string()
      .default(
        "Direct answers on how our independent advisory engagements are scoped, executed, and governed.",
      ),
    items: z.array(faqItemSchema).min(1),
  }),
});
export type FaqSection = z.infer<typeof faqSectionSchema>;

// 9. Pre-Footer Inset CTA Section
export const ctaSectionSchema = z.object({
  type: z.literal("cta"),
  id: z.string().default(() => crypto.randomUUID()),
  enabled: z.boolean().default(true),
  data: z.object({
    eyebrow: z.string().default("DIRECT PRINCIPAL ENGAGEMENT"),
    title: z
      .string()
      .default("Ready for an Initial Strategic Advisory Discussion?"),
    lead: z
      .string()
      .default(
        "Connect directly with our Lead Consultants to discuss financial controls, JV governance, or fiscal regime optimization.",
      ),
    buttonText: z.string().default("Book an Advisory Discussion"),
    buttonLink: z.string().default("/book-a-call"),
    secondaryText: z.string().optional(),
    secondaryLink: z.string().optional(),
  }),
});
export type CtaSection = z.infer<typeof ctaSectionSchema>;

// Discriminated Union for Page Sections
export const pageSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  marqueeSectionSchema,
  introSectionSchema,
  servicesSectionSchema,
  processSectionSchema,
  whyUsSectionSchema,
  teamSectionSchema,
  faqSectionSchema,
  ctaSectionSchema,
]);
export type PageSection = z.infer<typeof pageSectionSchema>;

export const pageSectionsArraySchema = z.array(pageSectionSchema);
