"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface StepItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables?: string[];
  takeaway?: string;
  tone?: "royal" | "charcoal" | "navy" | "slate";
}

interface StickyStackProps {
  steps: StepItem[];
  className?: string;
}

export function StickyStack({ steps, className = "" }: StickyStackProps) {
  const [activeStep, setActiveStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = window.innerHeight * 0.4;

      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStep = (index: number) => {
    const el = cardRefs.current[index];
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const getToneClasses = (tone?: string) => {
    switch (tone) {
      case "charcoal":
        return "bg-ink-900 text-white border-white/10";
      case "slate":
        return "bg-slate-600 text-white border-white/10";
      case "navy":
        return "bg-navy-950 text-white border-white/10";
      default:
        return "bg-royal-800 text-white border-white/10";
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16",
        className,
      )}
    >
      {/* Pinned Left Tracker */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32 space-y-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-royal-600 inline-block" />
            Advisory Process Steps
          </p>
          <div className="space-y-3 pt-2">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => scrollToStep(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center gap-4 cursor-pointer",
                    isActive
                      ? "bg-royal-600 text-white shadow-md"
                      : "bg-white hover:bg-sky-50 text-slate-600 border border-silver-400/20",
                  )}
                >
                  <span
                    className={cn(
                      "font-display text-sm tracking-wider",
                      isActive ? "text-sky-100" : "text-slate-600",
                    )}
                  >
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "font-semibold text-sm",
                        isActive ? "text-white" : "text-ink-900",
                      )}
                    >
                      {step.title}
                    </p>
                    <p
                      className={cn(
                        "text-xs truncate",
                        isActive ? "text-sky-100" : "text-slate-600",
                      )}
                    >
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrolling Right Cards */}
      <div className="lg:col-span-7 space-y-8">
        {steps.map((step, idx) => (
          <div
            key={step.number}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className={cn(
              "rounded-3xl p-6 sm:p-8 md:p-10 border shadow-sm transition-all duration-500",
              getToneClasses(step.tone),
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-2xl tracking-tight text-sky-100">
                {step.number}
              </span>
              <span className="text-xs uppercase tracking-widest text-silver-400 font-semibold">
                Phase {idx + 1}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-display uppercase tracking-tight text-white mb-3">
              {step.title}
            </h3>
            <p className="text-silver-400 text-base leading-relaxed mb-6">
              {step.description}
            </p>

            {step.deliverables && step.deliverables.length > 0 && (
              <div className="space-y-2 mb-6 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold tracking-wider uppercase text-sky-100">
                  Deliverables & Activities:
                </p>
                <ul className="space-y-1.5 text-sm text-silver-400">
                  {step.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-sky-100 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.takeaway && (
              <div className="rounded-xl bg-white/10 p-4 border border-white/10 mt-4">
                <p className="text-xs font-semibold uppercase text-sky-100 mb-1">
                  What You Get:
                </p>
                <p className="text-sm text-white font-medium">
                  {step.takeaway}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
