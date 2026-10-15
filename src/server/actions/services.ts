"use server";

import { eq } from "drizzle-orm";
import { serviceInputSchema } from "@/lib/schemas/service";
import { recordAuditLog } from "@/server/audit/audit";
import { requireRole } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { services } from "@/server/db/schema";
import { revalidateContent } from "./revalidate";

export async function createServiceAction(rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = serviceInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [service] = await db
    .insert(services)
    .values({
      slug: validated.data.slug,
      title: validated.data.title,
      tagline: validated.data.tagline,
      summary: validated.data.summary,
      body: validated.data.body,
      icon: validated.data.icon,
      cardTone: validated.data.cardTone,
      image: validated.data.image,
      sortOrder: validated.data.sortOrder,
      seoTitle: validated.data.seoTitle,
      seoDescription: validated.data.seoDescription,
      status: validated.data.status,
    })
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "service.create",
    entity: "services",
    entityId: service?.id,
    summary: { title: validated.data.title, slug: validated.data.slug },
  });

  await revalidateContent(["services", "pages"]);

  return { success: true, service };
}

export async function updateServiceAction(id: string, rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = serviceInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [service] = await db
    .update(services)
    .set({
      slug: validated.data.slug,
      title: validated.data.title,
      tagline: validated.data.tagline,
      summary: validated.data.summary,
      body: validated.data.body,
      icon: validated.data.icon,
      cardTone: validated.data.cardTone,
      image: validated.data.image,
      sortOrder: validated.data.sortOrder,
      seoTitle: validated.data.seoTitle,
      seoDescription: validated.data.seoDescription,
      status: validated.data.status,
      updatedAt: new Date(),
    })
    .where(eq(services.id, id))
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "service.update",
    entity: "services",
    entityId: id,
    summary: { title: validated.data.title, status: validated.data.status },
  });

  await revalidateContent(["services", "pages"]);

  return { success: true, service };
}

export async function deleteServiceAction(id: string) {
  const { user } = await requireRole("editor");

  const [deleted] = await db
    .delete(services)
    .where(eq(services.id, id))
    .returning();

  if (deleted) {
    await recordAuditLog({
      userId: user.id,
      action: "service.delete",
      entity: "services",
      entityId: id,
      summary: { title: deleted.title },
    });
  }

  await revalidateContent(["services", "pages"]);

  return { success: true };
}

export async function reorderServicesAction(
  items: { id: string; sortOrder: number }[],
) {
  const { user } = await requireRole("editor");

  for (const item of items) {
    await db
      .update(services)
      .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
      .where(eq(services.id, item.id));
  }

  await recordAuditLog({
    userId: user.id,
    action: "service.reorder",
    entity: "services",
    summary: { count: items.length },
  });

  await revalidateContent(["services", "pages"]);

  return { success: true };
}
