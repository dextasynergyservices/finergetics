import { z } from "zod";
import { imageRefSchema, publishStatusSchema, slugSchema } from "./common";

export const teamMemberInputSchema = z.object({
  slug: slugSchema,
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  role: z
    .string()
    .min(2, "Role is required")
    .max(100, "Role cannot exceed 100 characters"),
  credentials: z.string().max(100).optional(),
  highlights: z.array(z.string()).default([]),
  bio: z.record(z.string(), z.unknown()).optional(), // Tiptap JSON
  photo: imageRefSchema.nullable().optional(),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  status: publishStatusSchema.default("draft"),
});

export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;

export const teamMemberUpdateSchema = teamMemberInputSchema.partial().extend({
  id: z.string().uuid("Invalid team member ID"),
});

export type TeamMemberUpdate = z.infer<typeof teamMemberUpdateSchema>;
