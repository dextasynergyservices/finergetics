"use server";

import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { recordAuditLog } from "@/server/audit/audit";
import { auth } from "@/server/auth/auth";
import { requireAdmin } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { account, adminInvitations, user } from "@/server/db/schema";
import { sendAdminInvitationEmail } from "@/server/email/send";

const inviteUserSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid work email address"),
  role: z.enum(["admin", "editor"]).default("editor"),
});

/**
 * Invites a new team member by creating an invitation token and sending
 * a branded React Email with an "Accept Invitation & Set Password" link.
 */
export async function inviteUserAction(rawInput: unknown) {
  const { user: currentUser } = await requireAdmin();

  const validated = inviteUserSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const cleanEmail = validated.data.email.toLowerCase().trim();

  // Check if user already has an active account
  const [existingUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, cleanEmail))
    .limit(1);

  if (existingUser) {
    return {
      success: false,
      error:
        "An administrator or editor account with this email already exists.",
    };
  }

  // Generate secure invitation token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours validity
  const inviterName = currentUser.name || currentUser.email;

  // Save or refresh invitation record
  const [invitation] = await db
    .insert(adminInvitations)
    .values({
      id: crypto.randomUUID(),
      email: cleanEmail,
      name: validated.data.name.trim(),
      role: validated.data.role,
      token,
      invitedBy: inviterName,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: adminInvitations.email,
      set: {
        name: validated.data.name.trim(),
        role: validated.data.role,
        token,
        invitedBy: inviterName,
        expiresAt,
      },
    })
    .returning();

  // Dispatch branded invitation email
  const emailResult = await sendAdminInvitationEmail({
    name: validated.data.name.trim(),
    email: cleanEmail,
    role: validated.data.role,
    token,
    invitedBy: inviterName,
  });

  if (!emailResult.success) {
    console.warn(
      `[Invitation Warning] Email failed to send to ${cleanEmail}: ${emailResult.error}`,
    );
  }

  await recordAuditLog({
    userId: currentUser.id,
    action: "user.invite",
    entity: "admin_invitations",
    entityId: invitation?.id,
    summary: {
      email: cleanEmail,
      role: validated.data.role,
      emailDispatched: emailResult.success,
    },
  });

  return {
    success: true,
    emailDispatched: emailResult.success,
    invitation,
  };
}

/**
 * Resends the invitation email to a pending user with a renewed 48h token
 */
export async function resendInvitationAction(email: string) {
  const { user: currentUser } = await requireAdmin();
  const cleanEmail = email.toLowerCase().trim();

  const [existing] = await db
    .select()
    .from(adminInvitations)
    .where(eq(adminInvitations.email, cleanEmail))
    .limit(1);

  if (!existing) {
    return {
      success: false,
      error: "No pending invitation found for this email.",
    };
  }

  const newToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const inviterName = currentUser.name || currentUser.email;

  await db
    .update(adminInvitations)
    .set({
      token: newToken,
      expiresAt,
      invitedBy: inviterName,
    })
    .where(eq(adminInvitations.email, cleanEmail));

  const emailResult = await sendAdminInvitationEmail({
    name: existing.name,
    email: cleanEmail,
    role: existing.role,
    token: newToken,
    invitedBy: inviterName,
  });

  return { success: true, emailDispatched: emailResult.success };
}

/**
 * Cancels and deletes a pending invitation
 */
export async function cancelInvitationAction(email: string) {
  await requireAdmin();
  const cleanEmail = email.toLowerCase().trim();

  await db
    .delete(adminInvitations)
    .where(eq(adminInvitations.email, cleanEmail));

  return { success: true };
}

/**
 * Retrieves all currently pending invitations for the admin user list
 */
export async function getPendingInvitationsAction() {
  await requireAdmin();

  const invites = await db
    .select()
    .from(adminInvitations)
    .orderBy(adminInvitations.createdAt);

  return invites;
}

/**
 * Publicly validates an invitation token when the user arrives at /admin/accept-invitation
 */
export async function validateInvitationTokenAction(token: string) {
  if (!token?.trim()) {
    return { valid: false, error: "No invitation token provided." };
  }

  const [invitation] = await db
    .select()
    .from(adminInvitations)
    .where(eq(adminInvitations.token, token.trim()))
    .limit(1);

  if (!invitation) {
    return {
      valid: false,
      error: "This invitation link is invalid or has already been used.",
    };
  }

  if (new Date() > new Date(invitation.expiresAt)) {
    return {
      valid: false,
      error:
        "This invitation link has expired. Please ask an administrator to resend your invite.",
    };
  }

  return {
    valid: true,
    invitation: {
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
    },
  };
}

const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Invitation token is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

/**
 * Completes the invitation: registers the user with their chosen password,
 * assigns their verified role, and consumes the invitation token.
 */
export async function acceptInvitationAction(rawInput: unknown) {
  const validated = acceptInvitationSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [invitation] = await db
    .select()
    .from(adminInvitations)
    .where(eq(adminInvitations.token, validated.data.token.trim()))
    .limit(1);

  if (!invitation) {
    return {
      success: false,
      error: "This invitation link is invalid or has already been used.",
    };
  }

  if (new Date() > new Date(invitation.expiresAt)) {
    return {
      success: false,
      error:
        "This invitation link has expired. Please ask an administrator for a new invite.",
    };
  }

  // Register user account in Better-Auth
  const res = await auth.api.signUpEmail({
    body: {
      email: invitation.email.toLowerCase(),
      password: validated.data.password,
      name: invitation.name,
    },
  });

  if (!res?.user) {
    return {
      success: false,
      error: "Failed to create user credentials in authentication system.",
    };
  }

  // Set designated role and mark email as verified
  await db
    .update(user)
    .set({
      role: invitation.role,
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(user.id, res.user.id));

  // Remove consumed invitation
  await db
    .delete(adminInvitations)
    .where(eq(adminInvitations.id, invitation.id));

  await recordAuditLog({
    userId: res.user.id,
    action: "user.accept_invitation",
    entity: "user",
    entityId: res.user.id,
    summary: {
      email: invitation.email,
      role: invitation.role,
    },
  });

  return { success: true, user: res.user };
}

export async function updateUserRoleAction(params: {
  userId: string;
  role: "admin" | "editor";
}) {
  const { user: currentUser } = await requireAdmin();

  if (params.userId === currentUser.id) {
    return {
      success: false,
      error: "Cannot modify your own administrator role",
    };
  }

  await db
    .update(user)
    .set({ role: params.role, updatedAt: new Date() })
    .where(eq(user.id, params.userId));

  await recordAuditLog({
    userId: currentUser.id,
    action: "user.update_role",
    entity: "user",
    entityId: params.userId,
    summary: { newRole: params.role },
  });

  return { success: true };
}

export async function deleteUserAction(targetUserId: string) {
  const { user: currentUser } = await requireAdmin();

  if (targetUserId === currentUser.id) {
    return {
      success: false,
      error: "Cannot delete your own administrator account",
    };
  }

  await db.delete(account).where(eq(account.userId, targetUserId));
  const [deleted] = await db
    .delete(user)
    .where(eq(user.id, targetUserId))
    .returning();

  if (deleted) {
    await recordAuditLog({
      userId: currentUser.id,
      action: "user.delete",
      entity: "user",
      entityId: targetUserId,
      summary: { email: deleted.email },
    });
  }

  return { success: true };
}

/**
 * Main administrator triggers a password reset email for another user account.
 * Better-Auth creates the token and dispatches the branded React Email with a 2-hour link.
 */
export async function triggerPasswordResetAction(targetUserId: string) {
  const { user: currentUser } = await requireAdmin();

  const [targetUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, targetUserId))
    .limit(1);

  if (!targetUser) {
    return { success: false, error: "User account not found." };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: targetUser.email,
        redirectTo: "/admin/reset-password",
      },
    });

    await recordAuditLog({
      userId: currentUser.id,
      action: "user.reset_password_requested",
      entity: "user",
      entityId: targetUser.id,
      summary: {
        email: targetUser.email,
        requestedBy: currentUser.email,
      },
    });

    return {
      success: true,
      message: `A password reset link has been emailed to ${targetUser.email}.`,
    };
  } catch (err) {
    console.error("[Users Action] Password reset error:", err);
    return {
      success: false,
      error: "Failed to generate password reset request. Please try again.",
    };
  }
}

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

/**
 * Public action used by the recipient to set their new password on /admin/reset-password
 */
export async function resetPasswordWithTokenAction(rawInput: unknown) {
  const validated = resetPasswordSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: validated.data.password,
        token: validated.data.token.trim(),
      },
    });

    return { success: true };
  } catch (err: unknown) {
    const msg =
      err && typeof err === "object" && "body" in err
        ? ((err as { body?: { message?: string } }).body?.message ??
          "Invalid or expired token.")
        : "Failed to reset password. The link may have expired.";

    return { success: false, error: msg };
  }
}
