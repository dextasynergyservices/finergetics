import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export type UserRole = "admin" | "editor";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Authoritative security check for Server Actions, Route Handlers, and Admin Page Loaders
 */
export async function requireRole(minRole: UserRole = "editor") {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const userRole = (session.user as { role?: UserRole }).role ?? "editor";

  if (minRole === "admin" && userRole !== "admin") {
    throw new Error(
      "Forbidden: This action requires administrator privileges.",
    );
  }

  return {
    session,
    user: session.user,
    role: userRole,
  };
}

export async function requireAdmin() {
  return requireRole("admin");
}
