/**
 * Security constants and validation rules for upload hardening,
 * anti-abuse protections, and Content Security Policies.
 * Safe to import across both server and client contexts.
 */

export const ALLOWED_UPLOAD_FOLDERS = [
  "finergetics",
  "finergetics/uploads",
  "finergetics/team",
  "finergetics/services",
  "finergetics/case-studies",
  "finergetics/blog",
  "finergetics/settings",
  "finergetics/pages",
] as const;

export type AllowedUploadFolder = (typeof ALLOWED_UPLOAD_FOLDERS)[number];

export const ALLOWED_IMAGE_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
] as const;

export type AllowedImageFormat = (typeof ALLOWED_IMAGE_FORMATS)[number];

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

/** Minimum required user dwell time (in ms) to detect headless spambots */
export const MIN_FORM_DWELL_TIME_MS = 1500;

/** Minimum reCAPTCHA v3 score threshold (out of 100) per §4.3 */
export const MIN_RECAPTCHA_SCORE_THRESHOLD = 50;

/**
 * Validates human dwell time on form submission
 */
export function isHumanDwellTime(
  formLoadedAt?: number,
  now: number = Date.now(),
  minMs: number = MIN_FORM_DWELL_TIME_MS,
): boolean {
  if (!formLoadedAt || typeof formLoadedAt !== "number") return false;
  return now - formLoadedAt >= minMs;
}

/**
 * Validates reCAPTCHA v3 score against the minimum threshold
 */
export function isSufficientRecaptchaScore(
  score?: number,
  minThreshold: number = MIN_RECAPTCHA_SCORE_THRESHOLD,
): boolean {
  if (typeof score !== "number") return false;
  return score >= minThreshold;
}

/**
 * Strips ASCII control characters to prevent header injection or log poisoning
 */
export function sanitizeSecurityInput(str: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Intentionally stripping non-printable control characters for input security
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
}
