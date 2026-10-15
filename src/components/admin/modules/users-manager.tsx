"use client";

import {
  Clock,
  KeyRound,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pagination } from "@/components/admin/pagination";
import { TableActionMenu } from "@/components/admin/table-actions";
import { cn } from "@/lib/utils";
import {
  cancelInvitationAction,
  deleteUserAction,
  inviteUserAction,
  resendInvitationAction,
  triggerPasswordResetAction,
  updateUserRoleAction,
} from "@/server/actions/users";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string | null;
  createdAt: Date;
}

export interface InvitationItem {
  id: string;
  email: string;
  name: string;
  role: string;
  invitedBy: string;
  expiresAt: Date;
  createdAt: Date;
}

interface UsersManagerProps {
  initialUsers: UserItem[];
  initialInvitations?: InvitationItem[];
  currentUserId: string;
}

export function UsersManager({
  initialUsers,
  initialInvitations = [],
  currentUserId,
}: UsersManagerProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [invitations, setInvitations] =
    useState<InvitationItem[]>(initialInvitations);
  const [activeTab, setActiveTab] = useState<"users" | "invites">("users");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [resetPasswordTarget, setResetPasswordTarget] =
    useState<UserItem | null>(null);
  const [cancelInviteTarget, setCancelInviteTarget] =
    useState<InvitationItem | null>(null);

  // New invite form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");

  // Users pagination
  const [usersPage, setUsersPage] = useState(1);
  const usersPageSize = 10;
  const totalUsersPages = Math.ceil(users.length / usersPageSize) || 1;
  const paginatedUsers = users.slice(
    (usersPage - 1) * usersPageSize,
    usersPage * usersPageSize,
  );

  // Invites pagination
  const [invitesPage, setInvitesPage] = useState(1);
  const invitesPageSize = 10;
  const totalInvitesPages =
    Math.ceil(invitations.length / invitesPageSize) || 1;
  const paginatedInvites = invitations.slice(
    (invitesPage - 1) * invitesPageSize,
    invitesPage * invitesPageSize,
  );

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await inviteUserAction({ name, email, role });
      if (res.success && res.invitation) {
        setInvitations([res.invitation as InvitationItem, ...invitations]);
        if (res.emailDispatched) {
          toast.success(
            `Invitation email sent to ${email}! They can now set their password.`,
          );
        } else {
          toast.info(
            `Invitation created for ${email}. (Email dispatch queued in background).`,
          );
        }
        setName("");
        setEmail("");
        setIsInviteOpen(false);
        setActiveTab("invites");
      } else {
        toast.error(res.error || "Failed to create invitation");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error sending invitation",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async (inv: InvitationItem) => {
    try {
      const res = await resendInvitationAction(inv.email);
      if (res.success) {
        toast.success(`Invitation email resent to ${inv.email}!`);
      } else {
        toast.error(res.error || "Failed to resend invitation");
      }
    } catch {
      toast.error("Error resending invitation");
    }
  };

  const handleCancelInvite = async () => {
    if (!cancelInviteTarget) return;
    try {
      const res = await cancelInvitationAction(cancelInviteTarget.email);
      if (res.success) {
        setInvitations(
          invitations.filter((i) => i.id !== cancelInviteTarget.id),
        );
        toast.success(`Invitation for ${cancelInviteTarget.email} cancelled`);
      } else {
        toast.error("Failed to cancel invitation");
      }
    } catch {
      toast.error("Error cancelling invitation");
    } finally {
      setCancelInviteTarget(null);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "editor",
  ) => {
    try {
      const res = await updateUserRoleAction({ userId, role: newRole });
      if (res.success) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
        toast.success("User role updated");
      } else {
        toast.error(res.error || "Failed to update role");
      }
    } catch {
      toast.error("Error updating user role");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteUserAction(deleteTarget.id);
      if (res.success) {
        setUsers(users.filter((u) => u.id !== deleteTarget.id));
        toast.success(`Account for ${deleteTarget.name} deleted`);
      } else {
        toast.error(res.error || "Failed to delete account");
      }
    } catch {
      toast.error("Error deleting user");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordTarget) return;
    try {
      const res = await triggerPasswordResetAction(resetPasswordTarget.id);
      if (res.success) {
        toast.success(
          res.message ||
            `Password reset link dispatched to ${resetPasswordTarget.email}`,
        );
      } else {
        toast.error(res.error || "Failed to trigger password reset");
      }
    } catch {
      toast.error("Error triggering password reset link");
    } finally {
      setResetPasswordTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Team &amp; Access Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Invite new administrators, assign roles, and manage active website
            operators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-silver-400/20 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-royal-600 text-white"
              : "bg-white text-slate-600 hover:bg-sky-50 border border-silver-400/25"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Active Accounts ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invites")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "invites"
              ? "bg-royal-600 text-white"
              : "bg-white text-slate-600 hover:bg-sky-50 border border-silver-400/25"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Pending Invitations ({invitations.length})</span>
        </button>
      </div>

      {/* Tab: Active Accounts */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-2xl border border-silver-400/25 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-royal-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-ink-900">
                        {u.name}
                      </h2>
                      {u.id === currentUserId && (
                        <span className="text-[10px] font-bold text-royal-600 px-2 py-0.5 rounded-md bg-royal-50">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-silver-400/15">
                  <span
                    className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-xl border select-none",
                      u.role === "admin"
                        ? "bg-royal-50 text-royal-700 border-royal-200"
                        : "bg-slate-50 text-slate-700 border-silver-400/30",
                    )}
                  >
                    {u.role === "admin" ? "Administrator" : "Editor"}
                  </span>

                  <TableActionMenu
                    items={[
                      {
                        label:
                          u.role === "admin"
                            ? "Switch Role to Editor"
                            : "Promote to Administrator",
                        icon: UserCheck,
                        disabled: u.id === currentUserId,
                        onClick: () =>
                          handleRoleChange(
                            u.id,
                            u.role === "admin" ? "editor" : "admin",
                          ),
                      },
                      {
                        label: "Send Password Reset Link",
                        icon: KeyRound,
                        onClick: () => setResetPasswordTarget(u),
                      },
                      {
                        label: "Delete User Account",
                        icon: Trash2,
                        destructive: true,
                        disabled: u.id === currentUserId,
                        onClick: () => setDeleteTarget(u),
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={usersPage}
            totalPages={totalUsersPages}
            totalItems={users.length}
            pageSize={usersPageSize}
            itemName="accounts"
            onPageChange={(page) => setUsersPage(page)}
          />
        </div>
      )}

      {/* Tab: Pending Invitations */}
      {activeTab === "invites" &&
        (invitations.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-silver-400/25 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-ink-900">
              No pending invitations
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click &ldquo;Invite Team Member&rdquo; above to send an email
              invitation to a new colleague.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {paginatedInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl border border-silver-400/25 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-ink-900">
                          {inv.name}
                        </h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Invitation
                        </span>
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-500">
                          Role: {inv.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {inv.email} &bull; Invited by {inv.invitedBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-silver-400/15">
                    <TableActionMenu
                      items={[
                        {
                          label: "Resend Invitation Email",
                          icon: RefreshCw,
                          onClick: () => handleResend(inv),
                        },
                        {
                          label: "Cancel Invitation",
                          icon: Trash2,
                          destructive: true,
                          onClick: () => setCancelInviteTarget(inv),
                        },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={invitesPage}
              totalPages={totalInvitesPages}
              totalItems={invitations.length}
              pageSize={invitesPageSize}
              itemName="invitations"
              onPageChange={(page) => setInvitesPage(page)}
            />
          </div>
        ))}

      {/* Invite Modal */}
      {isInviteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsInviteOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsInviteOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-silver-400/25 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div>
              <h2 className="text-base font-bold text-ink-900">
                Invite Team Member
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We will email them a secure invitation link where they will
                create their own password.
              </p>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label
                  htmlFor="user-name"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Colleague&apos;s Full Name *
                </label>
                <input
                  id="user-name"
                  type="text"
                  required
                  placeholder="e.g. Alison Consultant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div>
                <label
                  htmlFor="user-email"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Work Email Address *
                </label>
                <input
                  id="user-email"
                  type="email"
                  required
                  placeholder="consultant@finergetics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div>
                <label
                  htmlFor="user-role"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Assigned Permission Role
                </label>
                <select
                  id="user-role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "admin" | "editor")
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white"
                >
                  <option value="editor">
                    Editor (Content Management &amp; Publishing)
                  </option>
                  <option value="admin">
                    Administrator (Full Platform Control &amp; Inquiries)
                  </option>
                </select>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-silver-400/20 text-[11px] text-slate-600 space-y-1">
                <span className="font-semibold text-royal-700 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Automated Setup Flow</span>
                </span>
                <p>
                  The recipient receives a one-time invitation valid for 48
                  hours. They will choose their own password upon clicking the
                  link.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl border border-silver-400/25 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send Invitation Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete User Account"
        description={`Are you sure you want to revoke access and delete the account for "${deleteTarget?.name}"?`}
        confirmLabel="Delete User"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* Password Reset Confirmation */}
      <ConfirmDialog
        open={Boolean(resetPasswordTarget)}
        onOpenChange={(open) => !open && setResetPasswordTarget(null)}
        title="Send Password Reset Link"
        description={`Send a password reset email to "${resetPasswordTarget?.name}" (${resetPasswordTarget?.email})? They will receive an email containing a secure link to create a new password, valid for 2 hours.`}
        confirmLabel="Send Reset Link"
        onConfirm={handleResetPassword}
      />

      {/* Cancel Invite Confirmation */}
      <ConfirmDialog
        open={Boolean(cancelInviteTarget)}
        onOpenChange={(open) => !open && setCancelInviteTarget(null)}
        title="Cancel Invitation"
        description={`Are you sure you want to revoke the pending invitation for "${cancelInviteTarget?.email}"?`}
        confirmLabel="Cancel Invitation"
        variant="destructive"
        onConfirm={handleCancelInvite}
      />
    </div>
  );
}
