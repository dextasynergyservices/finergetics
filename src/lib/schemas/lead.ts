import { z } from "zod";
import { leadStatusSchema } from "./common";

// Public submission: Book a Call form
export const bookCallSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Please provide a valid work email address"),
  phone: z
    .string()
    .min(7, "Please provide a valid phone number")
    .max(30)
    .optional()
    .or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  interest: z.string().optional().or(z.literal("")),
  preferredTime: z.string().max(100).optional().or(z.literal("")),
  message: z
    .string()
    .max(2000, "Message cannot exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification is required"),
  // Honeypot field (must remain empty for legitimate human visitors)
  websiteUrl: z.string().max(0, "Bot detected").optional().default(""),
});

export type BookCallInput = z.infer<typeof bookCallSchema>;

export const publicInquirySchema = z.object({
  type: z.enum(["book_call", "contact"]).default("book_call"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Please provide a valid work email address"),
  phone: z.string().max(30).optional().or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  interest: z.string().optional().or(z.literal("")),
  preferredTime: z.string().max(100).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification is required"),
  websiteUrl: z
    .string()
    .max(0, "Automated submission detected")
    .optional()
    .default(""),
});

export type PublicInquiryInput = z.infer<typeof publicInquirySchema>;

// Public submission: General contact inquiry
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().max(30).optional().or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Please provide a detailed message (at least 10 characters)")
    .max(2000, "Message cannot exceed 2000 characters"),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification is required"),
  websiteUrl: z.string().max(0, "Bot detected").optional().default(""),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Admin lead management
export const leadUpdateSchema = z.object({
  id: z.string().uuid("Invalid lead ID"),
  status: leadStatusSchema,
  notes: z.string().max(5000).optional(),
});

export type LeadUpdate = z.infer<typeof leadUpdateSchema>;
