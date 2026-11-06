import { z } from "zod";
import {
  imageRefSchema,
  optionalText,
  publishStatusSchema,
  richTextDocSchema,
  slugSchema,
} from "./common";

export const metricItemSchema = z.object({
  label: z.string().min(1, "Metric label is required"),
  value: z.string().min(1, "Metric value is required"),
});
export type MetricItem = z.infer<typeof metricItemSchema>;

export const caseStudyInputSchema = z.object({
  slug: slugSchema,
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  clientName: optionalText(120),
  industry: optionalText(100),
  serviceId: z.string().uuid("Invalid service ID").optional().nullable(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(600, "Summary cannot exceed 600 characters"),
  challenge: richTextDocSchema, // Tiptap JSON
  approach: richTextDocSchema, // Tiptap JSON
  outcome: richTextDocSchema, // Tiptap JSON
  metrics: z.array(metricItemSchema).default([]),
  cover: imageRefSchema.nullable().optional(),
  featured: z.boolean().default(false),
  publishedAt: z.coerce.date().optional().nullable(),
  seoTitle: optionalText(160),
  seoDescription: optionalText(320),
  status: publishStatusSchema.default("draft"),
});

export type CaseStudyInput = z.infer<typeof caseStudyInputSchema>;

export const caseStudyUpdateSchema = caseStudyInputSchema.partial().extend({
  id: z.string().uuid("Invalid case study ID"),
});

export type CaseStudyUpdate = z.infer<typeof caseStudyUpdateSchema>;
