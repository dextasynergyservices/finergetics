import { z } from "zod";
import { imageRefSchema, publishStatusSchema } from "./common";
import { pageSectionsArraySchema } from "./sections";

export const pageKeySchema = z.enum([
  "home",
  "about",
  "services",
  "case-studies",
  "blog",
  "contact",
  "privacy",
  "terms",
]);
export type PageKey = z.infer<typeof pageKeySchema>;

export const pageInputSchema = z.object({
  key: pageKeySchema,
  title: z.string().min(2, "Page title is required").max(120),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  ogImage: imageRefSchema.nullable().optional(),
  sections: pageSectionsArraySchema.default([]),
  status: publishStatusSchema.default("published"),
});

export type PageInput = z.infer<typeof pageInputSchema>;

export const pageUpdateSchema = pageInputSchema.partial().extend({
  id: z.string().uuid("Invalid page ID"),
});

export type PageUpdate = z.infer<typeof pageUpdateSchema>;
