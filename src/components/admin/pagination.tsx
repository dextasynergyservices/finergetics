"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  itemName?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  itemName = "records",
  className = "",
}: PaginationProps) {
  if (totalPages <= 1 && (!totalItems || totalItems === 0)) {
    return null;
  }

  // Calculate start and end range for "Showing X to Y of Z"
  let startItem = 1;
  let endItem = totalItems ?? 0;
  if (totalItems !== undefined && pageSize !== undefined) {
    startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
    endItem = Math.min(currentPage * pageSize, totalItems);
  }

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`p-4 rounded-2xl bg-white border border-silver-400/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs ${className}`}
    >
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        {totalItems !== undefined ? (
          <>
            <span>Showing</span>
            <span className="font-bold text-ink-900">{startItem}</span>
            <span>–</span>
            <span className="font-bold text-ink-900">{endItem}</span>
            <span>of</span>
            <span className="font-bold text-ink-900">{totalItems}</span>
            <span>{itemName}</span>
          </>
        ) : (
          <span>
            Page <strong className="text-ink-900">{currentPage}</strong> of{" "}
            <strong className="text-ink-900">{totalPages}</strong>
          </span>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-silver-400/25 bg-white text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1 px-1">
            {getPageNumbers().map((page, index) => {
              if (page === "ellipsis") {
                const ellipsisKey =
                  index === 1 ? "ellipsis-left" : "ellipsis-right";
                return (
                  <span
                    key={ellipsisKey}
                    className="px-2 text-slate-400 font-bold"
                  >
                    …
                  </span>
                );
              }

              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`w-7 h-7 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-royal-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-sky-50 hover:text-ink-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-silver-400/25 bg-white text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
