import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { requireAdmin, requireRole } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import {
  auditLog,
  caseStudies,
  leads,
  mediaAssets,
  pages,
  postCategories,
  posts,
  services,
  siteSettings,
  teamMembers,
  user,
} from "@/server/db/schema";

export async function getAdminSiteSettings() {
  await requireAdmin();
  const row = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);
  return row[0]?.data ?? null;
}

export async function getAdminMediaAssets() {
  await requireRole("editor");
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
}

export async function getAdminTeamMembers() {
  await requireRole("editor");
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.createdAt));
}

export async function getAdminTeamMemberById(id: string) {
  await requireRole("editor");
  const row = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);
  return row[0] ?? null;
}

export async function getAdminServices() {
  await requireRole("editor");
  return db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder), asc(services.createdAt));
}

export async function getAdminServiceById(id: string) {
  await requireRole("editor");
  const row = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return row[0] ?? null;
}

export async function getAdminCaseStudies() {
  await requireRole("editor");
  return db.select().from(caseStudies).orderBy(desc(caseStudies.createdAt));
}

export async function getAdminCaseStudyById(id: string) {
  await requireRole("editor");
  const row = await db
    .select()
    .from(caseStudies)
    .where(eq(caseStudies.id, id))
    .limit(1);
  return row[0] ?? null;
}

export async function getAdminPostCategories() {
  await requireRole("editor");
  return db.select().from(postCategories).orderBy(asc(postCategories.name));
}

export async function getAdminPosts() {
  await requireRole("editor");
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getAdminPostById(id: string) {
  await requireRole("editor");
  const row = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return row[0] ?? null;
}

export async function getAdminPages() {
  await requireRole("editor");
  return db.select().from(pages).orderBy(asc(pages.title));
}

export async function getAdminPageByKey(key: string) {
  await requireRole("editor");
  const row = await db.select().from(pages).where(eq(pages.key, key)).limit(1);
  return row[0] ?? null;
}

export async function getAdminLeads() {
  await requireAdmin();
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getAdminUsers() {
  await requireAdmin();
  return db.select().from(user).orderBy(desc(user.createdAt));
}

export async function getAdminAuditLogs(limit = 100) {
  await requireAdmin();
  return db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}
