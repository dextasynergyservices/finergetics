import { z } from "zod";
import { imageRefSchema, publishStatusSchema, slugSchema } from "./common";

export const serviceCardToneSchema = z.enum([
  "royal",
  "charcoal",
  "navy",
  "slate",
]);
export type ServiceCardTone = z.infer<typeof serviceCardToneSchema>;

export const serviceInputSchema = z.object({
  slug: slugSchema,
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(160, "Title cannot exceed 160 characters"),
  tagline: z.string().max(160).optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(500, "Summary cannot exceed 500 characters"),
  body: z.record(z.string(), z.unknown()).optional(), // Tiptap JSON
  icon: z.string().optional(),
  cardTone: serviceCardToneSchema.default("royal"),
  image: imageRefSchema.nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  status: publishStatusSchema.default("draft"),
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;

export const serviceUpdateSchema = serviceInputSchema.partial().extend({
  id: z.string().uuid("Invalid service ID"),
});

export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>;
