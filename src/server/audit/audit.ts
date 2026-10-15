import "server-only";

import { db } from "@/server/db/client";
import { auditLog } from "@/server/db/schema";

export interface RecordAuditParams {
  userId: string;
  action: string; // e.g. "settings.update", "service.create", "team.reorder"
  entity: string; // e.g. "site_settings", "service", "team_member"
  entityId?: string | null;
  summary?: Record<string, unknown> | null;
}

/**
 * Persists an immutable audit entry for every administrative mutation.
 */
export async function recordAuditLog(params: RecordAuditParams) {
  try {
    await db.insert(auditLog).values({
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId ?? null,
      summary: params.summary ?? null,
    });
  } catch (error) {
    // Audit logging failure should not completely crash operation, but log to error
    console.error("Failed to write audit log entry:", error);
  }
}
