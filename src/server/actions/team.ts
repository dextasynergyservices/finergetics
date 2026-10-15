"use server";

import { eq } from "drizzle-orm";
import { teamMemberInputSchema } from "@/lib/schemas/team";
import { recordAuditLog } from "@/server/audit/audit";
import { requireRole } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { teamMembers } from "@/server/db/schema";
import { revalidateContent } from "./revalidate";

export async function createTeamMemberAction(rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = teamMemberInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [member] = await db
    .insert(teamMembers)
    .values({
      slug: validated.data.slug,
      name: validated.data.name,
      role: validated.data.role,
      credentials: validated.data.credentials,
      highlights: validated.data.highlights,
      bio: validated.data.bio,
      photo: validated.data.photo,
      linkedinUrl: validated.data.linkedinUrl || null,
      sortOrder: validated.data.sortOrder,
      status: validated.data.status,
    })
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "team.create",
    entity: "team_members",
    entityId: member?.id,
    summary: { name: validated.data.name, slug: validated.data.slug },
  });

  await revalidateContent(["team", "pages"]);

  return { success: true, member };
}

export async function updateTeamMemberAction(id: string, rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = teamMemberInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [member] = await db
    .update(teamMembers)
    .set({
      slug: validated.data.slug,
      name: validated.data.name,
      role: validated.data.role,
      credentials: validated.data.credentials,
      highlights: validated.data.highlights,
      bio: validated.data.bio,
      photo: validated.data.photo,
      linkedinUrl: validated.data.linkedinUrl || null,
      sortOrder: validated.data.sortOrder,
      status: validated.data.status,
      updatedAt: new Date(),
    })
    .where(eq(teamMembers.id, id))
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "team.update",
    entity: "team_members",
    entityId: id,
    summary: { name: validated.data.name, status: validated.data.status },
  });

  await revalidateContent(["team", "pages"]);

  return { success: true, member };
}

export async function deleteTeamMemberAction(id: string) {
  const { user } = await requireRole("editor");

  const [deleted] = await db
    .delete(teamMembers)
    .where(eq(teamMembers.id, id))
    .returning();

  if (deleted) {
    await recordAuditLog({
      userId: user.id,
      action: "team.delete",
      entity: "team_members",
      entityId: id,
      summary: { name: deleted.name },
    });
  }

  await revalidateContent(["team", "pages"]);

  return { success: true };
}

export async function reorderTeamMembersAction(
  items: { id: string; sortOrder: number }[],
) {
  const { user } = await requireRole("editor");

  for (const item of items) {
    await db
      .update(teamMembers)
      .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
      .where(eq(teamMembers.id, item.id));
  }

  await recordAuditLog({
    userId: user.id,
    action: "team.reorder",
    entity: "team_members",
    summary: { count: items.length },
  });

  await revalidateContent(["team", "pages"]);

  return { success: true };
}
