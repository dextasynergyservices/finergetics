import { z } from "zod";
import {
  imageRefSchema,
  optionalText,
  publishStatusSchema,
  richTextDocSchema,
  slugSchema,
} from "./common";

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
  tagline: optionalText(160),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(500, "Summary cannot exceed 500 characters"),
  body: richTextDocSchema, // Tiptap JSON
  icon: optionalText(),
  cardTone: serviceCardToneSchema.default("royal"),
  image: imageRefSchema.nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  seoTitle: optionalText(160),
  seoDescription: optionalText(320),
  status: publishStatusSchema.default("draft"),
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;

export const serviceUpdateSchema = serviceInputSchema.partial().extend({
  id: z.string().uuid("Invalid service ID"),
});

export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>;
