import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Thesis */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center group">
              <Image
                src="/logo-white.png"
                alt="Finergetics Consulting Limited"
                width={143}
                height={39}
                className="h-8 sm:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
                unoptimized
              />
            </Link>
            <p className="text-silver-400 text-sm leading-relaxed max-w-sm pt-2">
              Helping businesses control risk, improve performance, and increase
              value. Independent advisory for oil & gas operators, JV partners,
              energy investors, and infrastructure institutions.
            </p>
            <p className="text-xs text-silver-400/60 pt-2">
              CAC Registered · Independent Energy & Financial Advisory
            </p>
          </div>

          {/* Column 2: Core Services */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-sky-100">
              Core Services
            </p>
            <ul className="space-y-2.5 text-sm text-silver-400">
              <li>
                <Link
                  href="/services/financial-control-and-advisory"
                  className="hover:text-white transition-colors"
                >
                  Financial Control & Advisory
                </Link>
              </li>
              <li>
                <Link
                  href="/services/commercial-economics-and-investment-analysis"
                  className="hover:text-white transition-colors"
                >
                  Commercial Economics & Valuation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ep-fiscal-regime-advisory"
                  className="hover:text-white transition-colors"
                >
                  E & P Fiscal Regime Advisory
                </Link>
              </li>
              <li>
                <Link
                  href="/services/performance-diagnosis-and-improvement"
                  className="hover:text-white transition-colors"
                >
                  Performance Diagnosis & Drivers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Directory */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-sky-100">
              Company
            </p>
            <ul className="space-y-2.5 text-sm text-silver-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about#team"
                  className="hover:text-white transition-colors"
                >
                  Consultant Team
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="hover:text-white transition-colors"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Latest Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/book-a-call"
                  className="hover:text-white transition-colors font-medium text-sky-100"
                >
                  Book an Advisory Call
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-sky-100">
              Direct Inquiries
            </p>
            <div className="space-y-2.5 text-sm text-silver-400">
              <p>
                <span className="block text-xs uppercase text-silver-400/60">
                  Email
                </span>
                <a
                  href="mailto:info@finergetics.com"
                  className="text-white hover:text-sky-100 transition-colors font-medium"
                >
                  info@finergetics.com
                </a>
              </p>
              <p>
                <span className="block text-xs uppercase text-silver-400/60">
                  Telephone
                </span>
                <a
                  href="tel:+2348037541083"
                  className="block hover:text-white transition-colors"
                >
                  +234 803 754 1083
                </a>
                <a
                  href="tel:+2348100403013"
                  className="block hover:text-white transition-colors"
                >
                  +234 810 040 3013
                </a>
              </p>
              <p className="text-xs text-silver-400/70 pt-1">
                Mon – Fri: 8:00 AM – 6:00 PM (WAT / GMT+1)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-silver-400/70">
          <p>© 2026 Finergetics Consulting Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Engagement
            </Link>
            <Link
              href="/admin/login"
              className="text-silver-400/40 hover:text-silver-400 transition-colors"
            >
              CMS Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
