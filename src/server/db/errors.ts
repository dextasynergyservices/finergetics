import "server-only";

/**
 * Translate database errors thrown inside server actions into messages an
 * admin can act on. Without this, Next.js replaces thrown errors in production
 * with a generic "An error occurred in the Server Components render" message.
 */

interface PgLikeError {
  code?: string;
  constraint?: string;
  constraint_name?: string;
  detail?: string;
  cause?: unknown;
}

function findPgError(err: unknown): PgLikeError | null {
  let current: unknown = err;
  // Drizzle wraps the driver error in `.cause`; walk a few levels.
  for (let i = 0; i < 4 && current && typeof current === "object"; i++) {
    const candidate = current as PgLikeError;
    if (typeof candidate.code === "string" && /^\d{5}$/.test(candidate.code)) {
      return candidate;
    }
    current = candidate.cause;
  }
  return null;
}

export function describeDbError(err: unknown, entityLabel = "item"): string {
  const pg = findPgError(err);

  if (pg?.code === "23505") {
    const constraint = pg.constraint ?? pg.constraint_name ?? "";
    if (constraint.includes("slug")) {
      return `Another ${entityLabel} already uses this URL slug. Please choose a different slug.`;
    }
    if (constraint.includes("key")) {
      return `A ${entityLabel} with this key already exists.`;
    }
    return `This ${entityLabel} conflicts with an existing record (duplicate value).`;
  }
  if (pg?.code === "23503") {
    return `This ${entityLabel} references a record that no longer exists (or is still referenced elsewhere). Refresh and try again.`;
  }
  if (pg?.code === "23502") {
    return `A required field for this ${entityLabel} is missing.`;
  }
  if (pg?.code === "22001") {
    return `One of the fields for this ${entityLabel} is too long.`;
  }

  console.error(`[DB] Unexpected error while saving ${entityLabel}:`, err);
  return `Could not save this ${entityLabel} due to a server error. Please try again.`;
}
