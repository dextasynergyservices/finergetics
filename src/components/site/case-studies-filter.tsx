"use client";

import { useMemo, useState } from "react";
import { CaseStudyCard } from "@/components/site/cards/case-study-card";
import { cn } from "@/lib/utils";

export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  clientName?: string | null;
  industry?: string | null;
  summary: string;
  metrics?: Array<{ label: string; value: string }> | null;
  serviceTitle?: string | null;
  serviceSlug?: string | null;
}

interface CaseStudiesFilterProps {
  caseStudies: CaseStudyItem[];
}

export function CaseStudiesFilter({ caseStudies }: CaseStudiesFilterProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");

  const industries = useMemo(() => {
    const set = new Set<string>();
    for (const cs of caseStudies) {
      if (cs.industry) set.add(cs.industry);
    }
    return ["all", ...Array.from(set)];
  }, [caseStudies]);

  const filtered = useMemo(() => {
    if (selectedIndustry === "all") return caseStudies;
    return caseStudies.filter((cs) => cs.industry === selectedIndustry);
  }, [caseStudies, selectedIndustry]);

  return (
    <div className="space-y-10">
      {/* Filter Chips */}
      {industries.length > 2 && (
        <div className="flex flex-wrap items-center gap-2">
          {industries.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => setSelectedIndustry(ind)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                selectedIndustry === ind
                  ? "bg-navy-950 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-silver-400/25 hover:bg-sky-50",
              )}
            >
              {ind === "all" ? "All Practice Sectors" : ind}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((cs) => {
          const metric = cs.metrics?.[0];
          return (
            <CaseStudyCard
              key={cs.slug}
              slug={cs.slug}
              title={cs.title}
              clientName={cs.clientName || undefined}
              industry={cs.industry || undefined}
              summary={cs.summary}
              metricValue={metric?.value}
              metricLabel={metric?.label}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-silver-400/20 space-y-2">
          <p className="font-display text-lg uppercase text-navy-950">
            No case studies found in this sector
          </p>
          <p className="text-xs text-slate-500">
            Please choose another filter or consult our advisory desk for custom
            project credentials.
          </p>
        </div>
      )}
    </div>
  );
}
