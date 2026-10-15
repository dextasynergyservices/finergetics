"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  actionButton?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Filter records...",
  actionButton,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={
              searchKey
                ? ((table.getColumn(searchKey)?.getFilterValue() as string) ??
                  "")
                : (globalFilter ?? "")
            }
            onChange={(e) => {
              if (searchKey) {
                table.getColumn(searchKey)?.setFilterValue(e.target.value);
              } else {
                setGlobalFilter(e.target.value);
              }
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-silver-400/25 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 shadow-xs"
          />
        </div>

        {actionButton && <div className="shrink-0">{actionButton}</div>}
      </div>

      {/* Table Container */}
      <div className="rounded-3xl bg-white border border-silver-400/25 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-silver-400/20 bg-sky-50/50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-silver-400/15 text-xs text-ink-900">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-sky-50/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-32 text-center text-xs text-slate-500"
                  >
                    No records found in this collection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {(() => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const totalRecords = data.length;
          const startRecord = totalRecords === 0 ? 0 : pageIndex * pageSize + 1;
          const endRecord = Math.min((pageIndex + 1) * pageSize, totalRecords);
          const pageCount = table.getPageCount() || 1;

          return (
            <div className="p-4 border-t border-silver-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-sky-50/30">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Showing</span>
                <span className="font-bold text-ink-900">{startRecord}</span>
                <span>–</span>
                <span className="font-bold text-ink-900">{endRecord}</span>
                <span>of</span>
                <span className="font-bold text-ink-900">{totalRecords}</span>
                <span>records</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-silver-400/20 bg-white text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <span className="px-2.5 text-xs font-semibold text-slate-700">
                  Page {pageIndex + 1} of {pageCount}
                </span>

                <button
                  type="button"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-silver-400/20 bg-white text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
