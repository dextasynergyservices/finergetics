import { z } from "zod";
import { imageRefSchema, publishStatusSchema, slugSchema } from "./common";

export const postCategoryInputSchema = z.object({
  slug: slugSchema,
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
});
export type PostCategoryInput = z.infer<typeof postCategoryInputSchema>;

export const postInputSchema = z.object({
  slug: slugSchema,
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters"),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt cannot exceed 500 characters"),
  body: z.record(z.string(), z.unknown()), // Tiptap JSON document
  cover: imageRefSchema.nullable().optional(),
  categoryId: z.string().uuid("Invalid category ID").optional().nullable(),
  authorId: z.string().uuid("Invalid author ID").optional().nullable(),
  readingMinutes: z.coerce.number().int().positive().default(5),
  publishedAt: z.coerce.date().optional().nullable(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  status: publishStatusSchema.default("draft"),
});

export type PostInput = z.infer<typeof postInputSchema>;

export const postUpdateSchema = postInputSchema.partial().extend({
  id: z.string().uuid("Invalid post ID"),
});

export type PostUpdate = z.infer<typeof postUpdateSchema>;
