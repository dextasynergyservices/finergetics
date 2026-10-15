"use client";

import { ArrowDown, ArrowUp, Edit3, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pagination } from "@/components/admin/pagination";
import { StatusBadge } from "@/components/admin/status-badge";
import { TableActionMenu } from "@/components/admin/table-actions";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import type { ImageRef } from "@/lib/schemas/common";
import {
  deleteTeamMemberAction,
  reorderTeamMembersAction,
} from "@/server/actions/team";

export interface TeamMemberItem {
  id: string;
  slug: string;
  name: string;
  role: string;
  credentials: string | null;
  sortOrder: number;
  status: "draft" | "published" | "archived";
  photo: ImageRef | null;
}

interface TeamListProps {
  initialMembers: TeamMemberItem[];
}

export function TeamList({ initialMembers }: TeamListProps) {
  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [deleteTarget, setDeleteTarget] = useState<TeamMemberItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(members.length / pageSize) || 1;
  const paginatedMembers = members.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const updated = [...members];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const payload = updated.map((m, idx) => ({ id: m.id, sortOrder: idx + 1 }));
    setMembers(updated.map((m, idx) => ({ ...m, sortOrder: idx + 1 })));

    try {
      await reorderTeamMembersAction(payload);
      toast.success("Team display order updated!");
    } catch {
      toast.error("Failed to persist order");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteTeamMemberAction(deleteTarget.id);
      if (res.success) {
        setMembers(members.filter((m) => m.id !== deleteTarget.id));
        toast.success(`Removed "${deleteTarget.name}" from team`);
      } else {
        toast.error("Failed to delete member");
      }
    } catch {
      toast.error("Error deleting team member");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Consultant & Team Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage principal bios, credentials, and re-order who appears first
            on the About page.
          </p>
        </div>

        <Link
          href="/admin/team/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </Link>
      </div>

      {/* List / Orderable Cards */}
      {members.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-silver-400/25 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink-900">
            No team members registered yet
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click &ldquo;Add Team Member&rdquo; above to create consultant
            profiles with credentials and bios.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedMembers.map((member, pageIdx) => {
              const globalIdx = (currentPage - 1) * pageSize + pageIdx;
              return (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-silver-400/25 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-silver-400/40 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={globalIdx === 0}
                        onClick={() => moveOrder(globalIdx, "up")}
                        className="p-1 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-ink-900 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={globalIdx === members.length - 1}
                        onClick={() => moveOrder(globalIdx, "down")}
                        className="p-1 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-ink-900 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-2xl bg-sky-50 border border-silver-400/20 overflow-hidden shrink-0 flex items-center justify-center">
                      {member.photo?.publicId ? (
                        <Image
                          src={getCloudinaryUrl(member.photo.publicId, {
                            width: 100,
                            height: 100,
                            crop: "thumb",
                            gravity: "face",
                          })}
                          alt={member.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    {/* Information */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-ink-900">
                          {member.name}
                        </h2>
                        {member.credentials && (
                          <span className="text-[11px] text-royal-600 font-semibold">
                            ({member.credentials})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-silver-400/15">
                    <StatusBadge status={member.status} />

                    <TableActionMenu
                      items={[
                        {
                          label: "Edit Profile",
                          icon: Edit3,
                          href: `/admin/team/${member.id}`,
                        },
                        {
                          label: "Move Up",
                          icon: ArrowUp,
                          disabled: globalIdx === 0,
                          onClick: () => moveOrder(globalIdx, "up"),
                        },
                        {
                          label: "Move Down",
                          icon: ArrowDown,
                          disabled: globalIdx === members.length - 1,
                          onClick: () => moveOrder(globalIdx, "down"),
                        },
                        {
                          label: "Delete Profile",
                          icon: Trash2,
                          destructive: true,
                          onClick: () => setDeleteTarget(member),
                        },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={members.length}
            pageSize={pageSize}
            itemName="consultants"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Team Member"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete Member"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
