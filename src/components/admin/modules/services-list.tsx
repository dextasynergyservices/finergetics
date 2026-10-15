"use client";

import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pagination } from "@/components/admin/pagination";
import { StatusBadge } from "@/components/admin/status-badge";
import { TableActionMenu } from "@/components/admin/table-actions";
import {
  deleteServiceAction,
  reorderServicesAction,
} from "@/server/actions/services";

export interface ServiceListItem {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  cardTone: string | null;
  sortOrder: number;
  status: "draft" | "published" | "archived";
}

interface ServicesListProps {
  initialServices: ServiceListItem[];
}

export function ServicesList({ initialServices }: ServicesListProps) {
  const [services, setServices] = useState<ServiceListItem[]>(initialServices);
  const [deleteTarget, setDeleteTarget] = useState<ServiceListItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(services.length / pageSize) || 1;
  const paginatedServices = services.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const updated = [...services];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const payload = updated.map((s, idx) => ({ id: s.id, sortOrder: idx + 1 }));
    setServices(updated.map((s, idx) => ({ ...s, sortOrder: idx + 1 })));

    try {
      await reorderServicesAction(payload);
      toast.success("Service display order updated!");
    } catch {
      toast.error("Failed to persist order");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteServiceAction(deleteTarget.id);
      if (res.success) {
        setServices(services.filter((s) => s.id !== deleteTarget.id));
        toast.success(`Deleted service "${deleteTarget.title}"`);
      } else {
        toast.error("Failed to delete service");
      }
    } catch {
      toast.error("Error deleting service");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Consulting Practice Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage consulting practice offerings, detail pages, card tones, and
            navigation order.
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-silver-400/25 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink-900">
            No services cataloged yet
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click &ldquo;Add Service&rdquo; above to create advisory practice
            offerings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedServices.map((service, pageIdx) => {
              const globalIdx = (currentPage - 1) * pageSize + pageIdx;
              return (
                <div
                  key={service.id}
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
                        disabled={globalIdx === services.length - 1}
                        onClick={() => moveOrder(globalIdx, "down")}
                        className="p-1 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-ink-900 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-royal-50 text-royal-700 font-bold flex items-center justify-center shrink-0 border border-royal-100">
                      <span className="text-xs">{globalIdx + 1}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-ink-900">
                          {service.title}
                        </h2>
                        {service.cardTone && (
                          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-sky-50 text-slate-600 border border-silver-400/20">
                            {service.cardTone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {service.tagline || service.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-silver-400/15">
                    <StatusBadge status={service.status} />

                    <TableActionMenu
                      items={[
                        {
                          label: "Edit Service Details",
                          icon: Edit3,
                          href: `/admin/services/${service.id}`,
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
                          disabled: globalIdx === services.length - 1,
                          onClick: () => moveOrder(globalIdx, "down"),
                        },
                        {
                          label: "Delete Service",
                          icon: Trash2,
                          destructive: true,
                          onClick: () => setDeleteTarget(service),
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
            totalItems={services.length}
            pageSize={pageSize}
            itemName="services"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This will remove the service detail page and navigation links.`}
        confirmLabel="Delete Service"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
