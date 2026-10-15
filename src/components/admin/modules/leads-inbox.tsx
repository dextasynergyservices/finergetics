"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Download,
  Loader2,
  Mail,
  Phone,
  StickyNote,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { TableActionMenu } from "@/components/admin/table-actions";
import type { LeadStatus } from "@/lib/schemas/common";
import {
  deleteLeadAction,
  updateLeadStatusAction,
} from "@/server/actions/leads";

export interface LeadItem {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string | null;
  message: string | null;
  preferredTime: string | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: Date;
}

interface LeadsInboxProps {
  initialLeads: LeadItem[];
}

export function LeadsInbox({ initialLeads }: LeadsInboxProps) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [deleteTarget, setDeleteTarget] = useState<LeadItem | null>(null);
  const [activeNoteLead, setActiveNoteLead] = useState<LeadItem | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await updateLeadStatusAction({
        id: leadId,
        status: newStatus,
      });
      if (res.success) {
        setLeads(
          leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
        );
        toast.success(`Lead status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Error updating lead status");
    }
  };

  const openNoteModal = (lead: LeadItem) => {
    setActiveNoteLead(lead);
    setNoteText(lead.notes || "");
  };

  const handleSaveNote = async () => {
    if (!activeNoteLead) return;
    setIsSavingNote(true);
    try {
      const res = await updateLeadStatusAction({
        id: activeNoteLead.id,
        status: activeNoteLead.status,
        notes: noteText,
      });
      if (res.success) {
        setLeads(
          leads.map((l) =>
            l.id === activeNoteLead.id ? { ...l, notes: noteText } : l,
          ),
        );
        toast.success("Internal notes saved");
        setActiveNoteLead(null);
      } else {
        toast.error("Failed to save note");
      }
    } catch {
      toast.error("Error saving note");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteLeadAction(deleteTarget.id);
      if (res.success) {
        setLeads(leads.filter((l) => l.id !== deleteTarget.id));
        toast.success("Lead removed from inbox");
      } else {
        toast.error("Failed to delete lead");
      }
    } catch {
      toast.error("Error deleting lead");
    } finally {
      setDeleteTarget(null);
    }
  };

  const exportCsv = () => {
    if (leads.length === 0) {
      toast.info("No leads available to export");
      return;
    }

    const headers = [
      "Date",
      "Type",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Interest",
      "Status",
      "Message",
      "Notes",
    ];

    const escapeCsv = (val: string | null | undefined) => {
      if (!val) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = leads.map((l) => [
      escapeCsv(new Date(l.createdAt).toISOString()),
      escapeCsv(l.type),
      escapeCsv(l.name),
      escapeCsv(l.email),
      escapeCsv(l.phone),
      escapeCsv(l.company),
      escapeCsv(l.interest),
      escapeCsv(l.status),
      escapeCsv(l.message),
      escapeCsv(l.notes),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `finergetics_leads_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported leads to CSV!");
  };

  const columns: ColumnDef<LeadItem>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const d = new Date(row.original.createdAt);
        return (
          <div className="text-[11px] text-slate-500 whitespace-nowrap">
            <p className="font-semibold text-ink-900">
              {d.toLocaleDateString("en-GB")}
            </p>
            <p>
              {d.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Contact Details",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-bold text-ink-900 text-xs">{row.original.name}</p>
          <div className="flex flex-col gap-0.5 text-[11px] text-slate-500">
            <a
              href={`mailto:${row.original.email}`}
              className="inline-flex items-center gap-1 hover:text-royal-600 truncate"
            >
              <Mail className="w-3 h-3 shrink-0" />
              <span>{row.original.email}</span>
            </a>
            {row.original.phone && (
              <a
                href={`tel:${row.original.phone}`}
                className="inline-flex items-center gap-1 hover:text-royal-600"
              >
                <Phone className="w-3 h-3 shrink-0" />
                <span>{row.original.phone}</span>
              </a>
            )}
            {row.original.company && (
              <div className="inline-flex items-center gap-1 text-slate-400">
                <Building2 className="w-3 h-3 shrink-0" />
                <span>{row.original.company}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "interest",
      header: "Inquiry & Interest",
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="inline-block px-2 py-0.5 rounded-md bg-royal-50 text-royal-700 font-bold text-[10px] uppercase">
            {row.original.type.replace("_", " ")}
          </span>
          <p className="text-xs font-semibold text-slate-700">
            {row.original.interest || "General Advisory"}
          </p>
          {row.original.message && (
            <p
              className="text-[11px] text-slate-500 line-clamp-2 max-w-xs"
              title={row.original.message}
            >
              {row.original.message}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <select
          value={row.original.status}
          onChange={(e) =>
            handleStatusChange(row.original.id, e.target.value as LeadStatus)
          }
          className="text-xs font-semibold px-2.5 py-1 rounded-xl border border-silver-400/30 bg-white text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 cursor-pointer"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
          <option value="spam">Spam</option>
        </select>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActionMenu
          items={[
            {
              label: row.original.notes
                ? "View / Edit Internal Note"
                : "Add Internal Note",
              icon: StickyNote,
              onClick: () => openNoteModal(row.original),
            },
            {
              label: "Mark as Contacted",
              disabled: row.original.status === "contacted",
              onClick: () => handleStatusChange(row.original.id, "contacted"),
            },
            {
              label: "Mark as Qualified",
              disabled: row.original.status === "qualified",
              onClick: () => handleStatusChange(row.original.id, "qualified"),
            },
            {
              label: "Mark as Closed",
              disabled: row.original.status === "closed",
              onClick: () => handleStatusChange(row.original.id, "closed"),
            },
            {
              label: "Delete Lead",
              icon: Trash2,
              destructive: true,
              onClick: () => setDeleteTarget(row.original),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Client Inquiries &amp; Advisory Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review inbound consultations, track qualification status, add
            internal notes, and export to CSV.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        searchPlaceholder="Search leads by name or email..."
      />

      {/* Internal Notes Modal */}
      {activeNoteLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveNoteLead(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setActiveNoteLead(null);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-silver-400/25 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div>
              <h2 className="text-sm font-bold text-ink-900">
                Internal Note: {activeNoteLead.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Private consultant commentary, follow-up milestones, or proposal
                stage.
              </p>
            </div>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Scheduled discovery meeting with CFO on Thursday 2pm..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveNoteLead(null)}
                className="px-4 py-2 rounded-xl border border-silver-400/25 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingNote}
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSavingNote && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Lead"
        description={`Are you sure you want to permanently delete inquiry from ${deleteTarget?.name}?`}
        confirmLabel="Delete Lead"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
