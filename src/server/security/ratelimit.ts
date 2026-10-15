import "server-only";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";
import { env } from "@/env";
import { db } from "@/server/db";

const RULES = {
  book_call: { max: 5, windowSec: 3600 },
  login: { max: 5, windowSec: 900 }, // 5 attempts per 15 minutes
  upload_sign: { max: 30, windowSec: 600 },
} as const;

export async function checkRateLimit(
  bucket: keyof typeof RULES,
  extraKey?: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const h = await headers();
  const ip =
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "127.0.0.1";

  const id = createHash("sha256")
    .update(`${env.RATE_LIMIT_SALT}:${extraKey ?? ip}`)
    .digest("hex");

  const key = `${bucket}:${id}`;
  const { max, windowSec } = RULES[bucket];
  const resetAt = new Date(Date.now() + windowSec * 1000);

  // Atomic upsert: one round-trip, safe under concurrency
  const res = (await db.execute(sql`
    INSERT INTO rate_limits (key, count, reset_at) VALUES (${key}, 1, ${resetAt})
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limits.reset_at < now() THEN 1 ELSE rate_limits.count + 1 END,
      reset_at = CASE WHEN rate_limits.reset_at < now() THEN ${resetAt} ELSE rate_limits.reset_at END
    RETURNING count`)) as unknown as
    | { rows?: Array<{ count: number }> }
    | Array<{ count: number }>;

  const row = Array.isArray(res) ? res[0] : res.rows?.[0];
  const count = Number(row?.count ?? 1);

  return {
    allowed: count <= max,
    remaining: Math.max(0, max - count),
  };
}

export async function limit(
  bucket: keyof typeof RULES,
  extraKey?: string,
): Promise<boolean> {
  const result = await checkRateLimit(bucket, extraKey);
  return result.allowed;
}
