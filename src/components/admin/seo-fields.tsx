"use client";

import { ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SeoFieldsProps {
  seoTitle?: string;
  onSeoTitleChange?: (val: string) => void;
  seoDescription?: string;
  onSeoDescriptionChange?: (val: string) => void;
  title?: string;
  description?: string;
  onChange?: (val: { title: string; description: string }) => void;
  canonicalSlug?: string;
}

export function SeoFields({
  seoTitle,
  onSeoTitleChange,
  seoDescription,
  onSeoDescriptionChange,
  title,
  description,
  onChange,
  canonicalSlug = "",
}: SeoFieldsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentTitle = title ?? seoTitle ?? "";
  const currentDesc = description ?? seoDescription ?? "";

  const handleTitleChange = (val: string) => {
    onSeoTitleChange?.(val);
    onChange?.({ title: val, description: currentDesc });
  };

  const handleDescChange = (val: string) => {
    onSeoDescriptionChange?.(val);
    onChange?.({ title: currentTitle, description: val });
  };

  const titleLength = currentTitle.length;
  const descLength = currentDesc.length;

  return (
    <div className="rounded-3xl bg-white border border-silver-400/25 overflow-hidden shadow-xs">
      {/* Accordion Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-sky-50/50 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-royal-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-tight text-ink-900">
              Search Engine Optimization (SEO)
            </h4>
            <p className="text-xs text-slate-500">
              Meta title, description, and search snippet previews
            </p>
          </div>
        </div>
        <div
          className={cn(
            "w-7 h-7 rounded-full bg-sky-50 text-slate-600 flex items-center justify-center transition-transform duration-200",
            isOpen && "rotate-180 bg-royal-600 text-white",
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Collapsible Panel */}
      {isOpen && (
        <div className="p-5 sm:p-6 border-t border-silver-400/20 space-y-6 bg-sky-50/30">
          {/* Live Google Search Snippet Preview */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Google SERP Preview (Desktop / Mobile)
            </span>
            <div className="p-4 rounded-2xl bg-white border border-silver-400/25 shadow-xs space-y-1 max-w-lg">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon.png"
                  alt="Finergetics"
                  width={16}
                  height={16}
                  unoptimized
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
                <div className="text-[11px] text-slate-500 truncate">
                  https://www.finergetics.com
                  {canonicalSlug ? `/${canonicalSlug}` : ""}
                </div>
              </div>
              <p className="text-base text-blue-800 font-medium hover:underline truncate cursor-pointer leading-snug">
                {currentTitle ||
                  "Finergetics Consulting Limited — Risk, Performance & Value"}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {currentDesc ||
                  "Independent financial control reviews, energy economics, fiscal regime advisory, and performance diagnosis."}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* SEO Title Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="seoTitle"
                  className="font-bold uppercase tracking-wider text-slate-600"
                >
                  Meta Title
                </label>
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    titleLength > 60
                      ? "text-amber-600 font-bold"
                      : "text-slate-400",
                  )}
                >
                  {titleLength} / 60 recommended
                </span>
              </div>
              <input
                id="seoTitle"
                type="text"
                value={currentTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Page Title — Finergetics Consulting Limited"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-silver-400/30 text-ink-900 text-xs focus:outline-none focus:ring-2 focus:ring-royal-600/30 focus:border-royal-600"
              />
            </div>

            {/* SEO Description Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="seoDesc"
                  className="font-bold uppercase tracking-wider text-slate-600"
                >
                  Meta Description
                </label>
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    descLength > 160
                      ? "text-amber-600 font-bold"
                      : "text-slate-400",
                  )}
                >
                  {descLength} / 160 recommended
                </span>
              </div>
              <textarea
                id="seoDesc"
                rows={3}
                value={currentDesc}
                onChange={(e) => handleDescChange(e.target.value)}
                placeholder="A compelling, search-optimized summary of this page..."
                className="w-full px-4 py-3 rounded-2xl bg-white border border-silver-400/30 text-ink-900 text-xs focus:outline-none focus:ring-2 focus:ring-royal-600/30 focus:border-royal-600 resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
