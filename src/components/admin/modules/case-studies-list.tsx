"use client";

import { Edit3, FolderKanban, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pagination } from "@/components/admin/pagination";
import { StatusBadge } from "@/components/admin/status-badge";
import { TableActionMenu } from "@/components/admin/table-actions";
import { deleteCaseStudyAction } from "@/server/actions/case-studies";

export interface CaseStudyListItem {
  id: string;
  slug: string;
  title: string;
  clientName: string | null;
  industry: string | null;
  featured: boolean;
  status: "draft" | "published" | "archived";
}

interface CaseStudiesListProps {
  initialCaseStudies: CaseStudyListItem[];
}

export function CaseStudiesList({ initialCaseStudies }: CaseStudiesListProps) {
  const [items, setItems] = useState<CaseStudyListItem[]>(initialCaseStudies);
  const [deleteTarget, setDeleteTarget] = useState<CaseStudyListItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteCaseStudyAction(deleteTarget.id);
      if (res.success) {
        setItems(items.filter((c) => c.id !== deleteTarget.id));
        toast.success(`Deleted case study "${deleteTarget.title}"`);
      } else {
        toast.error("Failed to delete case study");
      }
    } catch {
      toast.error("Error deleting case study");
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
            Client Engagements & Case Studies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Proven outcomes, quantitative impact metrics, and client engagement
            narratives.
          </p>
        </div>

        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Case Study</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-silver-400/25 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink-900">
            No case studies published yet
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click &ldquo;Add Case Study&rdquo; above to document proven client
            advisory outcomes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-silver-400/25 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-silver-400/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-royal-50 text-royal-600 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-ink-900">
                        {item.title}
                      </h2>
                      {item.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.clientName || "Confidential Client"} •{" "}
                      {item.industry || "Advisory"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-silver-400/15">
                  <StatusBadge status={item.status} />

                  <TableActionMenu
                    items={[
                      {
                        label: "Edit Case Study",
                        icon: Edit3,
                        href: `/admin/case-studies/${item.id}`,
                      },
                      {
                        label: "Delete Case Study",
                        icon: Trash2,
                        destructive: true,
                        onClick: () => setDeleteTarget(item),
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={items.length}
            pageSize={pageSize}
            itemName="case studies"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Case Study"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Case Study"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
