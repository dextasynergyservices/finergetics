import { z } from "zod";

export const imageRefSchema = z.object({
  publicId: z.string().min(1, "Cloudinary public ID is required"),
  width: z.number().int().positive("Width must be positive"),
  height: z.number().int().positive("Height must be positive"),
  alt: z.string().default(""),
  blur: z.string().optional(),
});

export type ImageRef = z.infer<typeof imageRefSchema>;

export const publishStatusSchema = z.enum(["draft", "published", "archived"]);
export type PublishStatus = z.infer<typeof publishStatusSchema>;

export const leadStatusSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
]);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(120, "Slug cannot exceed 120 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens",
  );

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  status: publishStatusSchema.optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
