import { z } from "zod";

export const imageRefSchema = z.object({
  publicId: z.string().min(1, "Cloudinary public ID is required"),
  width: z.coerce
    .number()
    .int()
    .positive("Width must be positive")
    .nullish()
    .transform((val) => val || 1200),
  height: z.coerce
    .number()
    .int()
    .positive("Height must be positive")
    .nullish()
    .transform((val) => val || 800),
  alt: z
    .string()
    .nullish()
    .transform((val) => val || ""),
  blur: z.string().optional(),
});

export type ImageRef = z.infer<typeof imageRefSchema>;

function humanizeKey(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Turn Zod issues into a message that names the offending field, e.g.
 * "Summary: Summary must be at least 10 characters; Sections › 2 › Title: Required".
 */
export function formatZodIssues(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): string {
  return issues
    .map((issue) => {
      const label = issue.path
        .map((p) =>
          typeof p === "number" ? String(p + 1) : humanizeKey(String(p)),
        )
        .join(" › ");
      return label ? `${label}: ${issue.message}` : issue.message;
    })
    .join("; ");
}

/**
 * Tiptap rich-text JSON document. Nullable JSONB columns come back from
 * Postgres as `null` (not `undefined`), so admin edit forms that round-trip a
 * record with no body must not be rejected. `null` is preserved so a field can
 * also be cleared intentionally.
 */
export const richTextDocSchema = z.record(z.string(), z.unknown()).nullish();

/**
 * Optional free-text field that tolerates DB `NULL` and normalizes it to
 * `undefined`. Use for every nullable text column edited in the admin.
 */
export const optionalText = (max?: number) =>
  (max ? z.string().max(max) : z.string())
    .nullish()
    .transform((val) => val ?? undefined);

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
