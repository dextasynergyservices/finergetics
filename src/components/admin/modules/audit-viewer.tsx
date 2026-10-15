"use client";

import { History, Search } from "lucide-react";
import { useState } from "react";
import { Pagination } from "@/components/admin/pagination";

export interface AuditLogItem {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  summary: unknown;
  createdAt: Date;
}

interface AuditViewerProps {
  initialLogs: AuditLogItem[];
}

export function AuditViewer({ initialLogs }: AuditViewerProps) {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filteredLogs = initialLogs.filter((log) => {
    const q = filter.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      log.userId.toLowerCase().includes(q) ||
      log.entityId?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Security &amp; Administrative Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable log of all content modifications, publishing changes, role
            elevations, and deletions.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by action or entity..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-white border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
          />
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-silver-400/25 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink-900">
            No matching audit events
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Audit logs are recorded automatically on every administrative
            action.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-silver-400/25 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-silver-400/15 bg-sky-50/50">
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Timestamp
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Action
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Target Entity
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Operator ID
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Summary Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-silver-400/15 text-xs">
                  {paginatedLogs.map((log) => {
                    const d = new Date(log.createdAt);
                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-sky-50/30 transition-colors"
                      >
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                          <span className="font-semibold text-ink-900">
                            {d.toLocaleDateString("en-GB")}
                          </span>
                          <span className="text-[11px] ml-1">
                            {d.toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-royal-50 text-royal-700 border border-royal-100">
                            {log.action}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-700">
                          {log.entity}
                          {log.entityId && (
                            <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[120px]">
                              {log.entityId}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {log.userId.slice(0, 12)}...
                        </td>

                        <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px] max-w-xs truncate">
                          {log.summary ? JSON.stringify(log.summary) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLogs.length}
            pageSize={pageSize}
            itemName="audit entries"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
