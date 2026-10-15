import { Compass } from "lucide-react";
import Link from "next/link";
import { CtaButton } from "@/components/site/cta-button";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50 text-foreground overflow-x-hidden max-w-full">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-2xl w-full text-center space-y-8 bg-white rounded-3xl p-8 sm:p-14 border border-silver-400/25 shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-royal-50 border border-royal-600/20 text-royal-600 flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-royal-600 block">
              Error 404 · Page Not Found
            </span>
            <h1 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-navy-950">
              The Requested Advisory Page Does Not Exist
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-body">
              The link you followed may be outdated, renamed, or moved. Explore
              our primary advisory directories below or return to the home page.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <CtaButton href="/" variant="primary" size="lg">
              Return to Homepage
            </CtaButton>
            <CtaButton href="/services" variant="outline" size="lg">
              View Core Services
            </CtaButton>
          </div>

          <div className="pt-8 border-t border-silver-400/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Link
              href="/about"
              className="hover:text-royal-600 transition-colors p-2"
            >
              About Us
            </Link>
            <Link
              href="/case-studies"
              className="hover:text-royal-600 transition-colors p-2"
            >
              Case Studies
            </Link>
            <Link
              href="/blog"
              className="hover:text-royal-600 transition-colors p-2"
            >
              Insights
            </Link>
            <Link
              href="/book-a-call"
              className="hover:text-royal-600 transition-colors p-2"
            >
              Book A Call
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
