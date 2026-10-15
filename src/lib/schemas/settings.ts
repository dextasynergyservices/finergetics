import { z } from "zod";

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  children: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
        tagline: z.string().optional(),
      }),
    )
    .optional(),
});
export type NavItem = z.infer<typeof navItemSchema>;

export const footerSectionSchema = z.object({
  title: z.string().min(1),
  links: z.array(
    z.object({ label: z.string().min(1), href: z.string().min(1) }),
  ),
});
export type FooterSection = z.infer<typeof footerSectionSchema>;

export const siteSettingsDataSchema = z.object({
  general: z.object({
    siteName: z.string().default("Finergetics Consulting Limited"),
    tagline: z.string().default("Consulting Limited"),
    brandLine: z
      .string()
      .default(
        "Helping businesses control risk, improve performance, and increase value.",
      ),
    missionStatement: z
      .string()
      .default(
        "We help organisations strengthen financial controls, optimise commercial decisions, improve operational performance, and manage risk.",
      ),
    defaultSeoTitle: z
      .string()
      .default("Finergetics Consulting Limited — Risk, Performance & Value"),
    defaultSeoDescription: z
      .string()
      .default(
        "Helping businesses control risk, improve performance, and increase value. Independent energy & financial advisory.",
      ),
  }),
  contact: z.object({
    email: z.string().email().default("info@finergetics.com"),
    phone1: z.string().default("+234 803 754 1083"),
    phone2: z.string().default("+234 810 040 3013"),
    businessHours: z
      .string()
      .default("Mon – Fri: 8:00 AM – 6:00 PM (WAT / GMT+1)"),
    address: z.string().optional().default("Lagos, Nigeria"),
  }),
  social: z.object({
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
  }),
  navigation: z.object({
    header: z.array(navItemSchema).default([]),
    footerSections: z.array(footerSectionSchema).default([]),
  }),
  security: z.object({
    recaptchaThreshold: z.number().min(0).max(100).default(50), // score x 100
  }),
});

export type SiteSettingsData = z.infer<typeof siteSettingsDataSchema>;
