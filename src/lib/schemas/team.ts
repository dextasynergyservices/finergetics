import { z } from "zod";
import {
  imageRefSchema,
  optionalText,
  publishStatusSchema,
  richTextDocSchema,
  slugSchema,
} from "./common";

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
  credentials: optionalText(100),
  highlights: z.array(z.string()).default([]),
  bio: richTextDocSchema, // Tiptap JSON
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
