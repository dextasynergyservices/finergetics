"use client";

import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CtaButton } from "@/components/site/cta-button";
import { cn } from "@/lib/utils";

const NAV_SERVICES = [
  {
    title: "Financial Control & Advisory",
    slug: "financial-control-and-advisory",
    tagline: "Independent Reviews & Recommendations",
  },
  {
    title: "Commercial Economics & Investment Analysis",
    slug: "commercial-economics-and-investment-analysis",
    tagline: "Valuation & Scenario Analysis",
  },
  {
    title: "E & P Fiscal Regime Advisory",
    slug: "ep-fiscal-regime-advisory",
    tagline: "Cost Analysis & Fiscal Regime Implications",
  },
  {
    title: "Performance Diagnosis & Improvement",
    slug: "performance-diagnosis-and-improvement",
    tagline: "Operational Insights & Value Drivers",
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open (native mobile app feel)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full max-w-full",
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-3.5 shadow-sm border-b border-silver-400/20"
            : "bg-transparent py-4 sm:py-5",
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Logo Wordmark */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-blue.png"
              alt="Finergetics Consulting Limited"
              width={201}
              height={54}
              className="h-8 sm:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-royal-600 transition-colors">
              Home
            </Link>

            {/* Services Dropdown */}
            <div className="relative group py-2">
              <Link
                href="/services"
                className="flex items-center gap-1 hover:text-royal-600 transition-colors py-1"
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </Link>

              <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-silver-400/20 p-3 space-y-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                {NAV_SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="block p-3 rounded-xl hover:bg-sky-50 transition-colors group/item"
                  >
                    <p className="text-xs font-bold text-ink-900 group-hover/item:text-royal-600 transition-colors">
                      {s.title}
                    </p>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {s.tagline}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/about"
              className="hover:text-royal-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/case-studies"
              className="hover:text-royal-600 transition-colors"
            >
              Case Studies
            </Link>
            <Link
              href="/blog"
              className="hover:text-royal-600 transition-colors"
            >
              Insights
            </Link>
          </nav>

          {/* Right CTA (Tablet / Desktop) */}
          <div className="hidden sm:flex items-center gap-4">
            <CtaButton href="/book-a-call" size="sm" variant="primary">
              Book an Advisory Discussion
            </CtaButton>
          </div>

          {/* Native-Feel Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden w-11 h-11 rounded-2xl bg-sky-50/80 active:bg-sky-100 border border-silver-400/20 text-ink-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            aria-label="Open Navigation Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-dialog"
          >
            <Menu className="w-5 h-5 text-ink-900" />
          </button>
        </div>
      </header>

      {/* Full-Screen Native Mobile Navigation Drawer */}
      <div
        id="mobile-nav-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-white flex flex-col duration-200",
          mobileMenuOpen
            ? "animate-in fade-in zoom-in-95 pointer-events-auto"
            : "hidden pointer-events-none",
        )}
      >
        {/* Native Top Bar */}
        <div className="px-5 py-4 border-b border-silver-400/20 flex items-center justify-between bg-white shrink-0">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <Image
              src="/logo-blue.png"
              alt="Finergetics Consulting Limited"
              width={201}
              height={54}
              className="h-7 sm:h-8 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            className="w-10 h-10 rounded-full bg-sky-50 active:bg-sky-100 text-ink-900 flex items-center justify-center transition-transform active:scale-90 border border-silver-400/20 cursor-pointer"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Native Scrollable List */}
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-10 overscroll-contain space-y-6">
          {/* Primary Navigation Card Group */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 px-3 pb-2.5">
              Navigation
            </p>
            <div className="bg-sky-50/60 rounded-3xl border border-silver-400/20 divide-y divide-silver-400/15 overflow-hidden shadow-xs">
              {/* Home */}
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center justify-between p-4 active:bg-sky-100/70 transition-colors"
              >
                <span className="font-ui text-base font-semibold text-ink-900">
                  Home
                </span>
                <ChevronRight className="w-4 h-4 text-silver-400" />
              </Link>

              {/* Services (Accordion - Closed by default) */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full flex items-center justify-between p-4 active:bg-sky-100/70 transition-colors text-left cursor-pointer"
                  aria-expanded={isServicesOpen}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-ui text-base font-semibold text-ink-900">
                      Services
                    </span>
                  </div>
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-600 transition-transform duration-200 border border-silver-400/20",
                      isServicesOpen && "rotate-180 bg-royal-600 text-white",
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Sub-List */}
                {isServicesOpen && (
                  <div className="bg-white/80 border-t border-silver-400/15 p-2 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                    <Link
                      href="/services"
                      onClick={closeMenu}
                      className="flex items-center justify-between p-3 rounded-2xl bg-royal-50/50 hover:bg-royal-50 text-royal-700 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      <span>Overview (All 4 Services)</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    {NAV_SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        onClick={closeMenu}
                        className="block p-3 rounded-2xl active:bg-sky-50 transition-colors"
                      >
                        <p className="text-xs font-bold text-ink-900">
                          {s.title}
                        </p>
                        <p className="text-[11px] text-slate-600 truncate mt-0.5">
                          {s.tagline}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* About Us */}
              <Link
                href="/about"
                onClick={closeMenu}
                className="flex items-center justify-between p-4 active:bg-sky-100/70 transition-colors"
              >
                <div>
                  <span className="font-ui text-base font-semibold text-ink-900 block">
                    About Us
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Our Mission & Consultant Team
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-silver-400" />
              </Link>

              {/* Case Studies */}
              <Link
                href="/case-studies"
                onClick={closeMenu}
                className="flex items-center justify-between p-4 active:bg-sky-100/70 transition-colors"
              >
                <div>
                  <span className="font-ui text-base font-semibold text-ink-900 block">
                    Case Studies
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Proven Engagements & Outcomes
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-silver-400" />
              </Link>

              {/* Insights / Blog */}
              <Link
                href="/blog"
                onClick={closeMenu}
                className="flex items-center justify-between p-4 active:bg-sky-100/70 transition-colors"
              >
                <div>
                  <span className="font-ui text-base font-semibold text-ink-900 block">
                    Insights & Perspectives
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Energy Economics & Fiscal Analysis
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-silver-400" />
              </Link>
            </div>
          </div>

          {/* Direct Advisory Contact Card Group */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 px-3 pb-2.5">
              Direct Contact
            </p>
            <div className="bg-sky-50/60 rounded-3xl border border-silver-400/20 divide-y divide-silver-400/15 overflow-hidden shadow-xs">
              <a
                href="mailto:info@finergetics.com"
                className="flex items-center justify-between p-4 active:bg-sky-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-royal-600 border border-silver-400/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-900">Email Us</p>
                    <p className="text-[11px] text-slate-600">
                      info@finergetics.com
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-silver-400" />
              </a>

              <a
                href="tel:+2348033246377"
                className="flex items-center justify-between p-4 active:bg-sky-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-royal-600 border border-silver-400/20">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-900">
                      Direct Phone
                    </p>
                    <p className="text-[11px] text-slate-600">
                      +234 803 324 6377 / +234 803 301 1334
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-silver-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Dock CTA */}
        <div className="p-5 bg-white border-t border-silver-400/20 shrink-0 space-y-2.5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <CtaButton
            href="/book-a-call"
            size="lg"
            variant="primary"
            className="w-full justify-center shadow-md active:scale-[0.98] transition-transform py-3.5"
            onClick={closeMenu}
          >
            Book an Advisory Discussion
          </CtaButton>
          <p className="text-[11px] text-center text-slate-600">
            Finergetics Consulting Limited · Independent Advisory
          </p>
        </div>
      </div>
    </>
  );
}
