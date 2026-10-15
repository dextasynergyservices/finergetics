"use client";

import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { submitLeadInquiryAction } from "@/server/actions/leads";

const ADVISORY_AREAS = [
  "Financial Control & Joint Venture Advisory",
  "Commercial Economics & Asset Valuation",
  "E & P Fiscal Regime & Petroleum Profit Tax",
  "Performance Diagnosis & Cost Optimization",
  "Mergers, Acquisitions & Asset Divestment",
  "Strategic Boardroom Consultation",
] as const;

const TIMING_OPTIONS = [
  "Within 24–48 Hours (Priority Advisory)",
  "Upcoming Week",
  "Morning Briefing (09:00 – 12:00 WAT)",
  "Afternoon Briefing (13:00 – 17:00 WAT)",
  "Flexible Scheduling",
] as const;

export function ConsultationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [interest, setInterest] = useState<string>(ADVISORY_AREAS[0]);
  const [preferredTime, setPreferredTime] = useState<string>(TIMING_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState(""); // Honeypot trap for bots

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim()) {
      setErrorMessage("Please provide your name and work email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // In development or when grecaptcha is not active on local hostnames,
      // provide test-token which is securely validated on the server action.
      let recaptchaToken = "dev-bypass";

      if (
        typeof window !== "undefined" &&
        (
          window as unknown as {
            grecaptcha?: {
              execute: (
                key: string,
                opts: { action: string },
              ) => Promise<string>;
            };
          }
        ).grecaptcha
      ) {
        try {
          const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
          if (siteKey) {
            recaptchaToken = await (
              window as unknown as {
                grecaptcha: {
                  execute: (
                    key: string,
                    opts: { action: string },
                  ) => Promise<string>;
                };
              }
            ).grecaptcha.execute(siteKey, { action: "book_call" });
          }
        } catch (tokenErr) {
          console.warn("[reCAPTCHA Client] Fallback used:", tokenErr);
        }
      }

      const res = await submitLeadInquiryAction({
        type: "book_call",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        interest,
        preferredTime,
        message: message.trim() || undefined,
        recaptchaToken,
        websiteUrl,
      });

      if (!res.success) {
        setErrorMessage(
          res.error || "Unable to submit your request. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("[Consultation Form] Error:", err);
      setErrorMessage(
        "A connection error occurred. Please check your network or email info@finergetics.com directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl bg-white border border-silver-400/30 p-8 sm:p-12 shadow-xl shadow-navy-950/5 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-royal-50 border border-royal-600/20 text-royal-600 mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2.5 max-w-md mx-auto">
          <h3 className="text-2xl font-bold font-sans tracking-tight text-navy-950">
            Consultation Request Received
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Thank you, <strong className="text-navy-950">{name}</strong>. A
            confirmation email has been dispatched to{" "}
            <strong className="text-royal-600">{email}</strong>.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            Our Senior Advisory Partners will review your inquiry and connect
            with you to coordinate your executive briefing.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/60 border border-royal-600/15 max-w-md mx-auto text-left space-y-2">
          <div className="flex items-center gap-2 text-royal-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Advisory Next Steps</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Engagement scope review by sector specialists</li>
            <li>Direct coordination of NDA if confidential data is involved</li>
            <li>Advisory calendar invite delivered to your inbox</li>
          </ul>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setName("");
              setEmail("");
              setPhone("");
              setCompany("");
              setMessage("");
            }}
            className="text-xs font-bold text-royal-600 hover:text-royal-700 underline underline-offset-4 cursor-pointer"
          >
            Submit another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white border border-silver-400/30 p-6 sm:p-10 shadow-xl shadow-navy-950/5 space-y-6"
    >
      {/* Honeypot field - visually hidden */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-url-hp">Leave this empty</label>
        <input
          id="website-url-hp"
          type="text"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2 border-b border-silver-400/20 pb-5">
        <div className="flex items-center gap-2 text-royal-600 text-xs font-bold uppercase tracking-widest">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Strategic Briefing</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-sans text-navy-950 tracking-tight">
          Request an Executive Consultation
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Discuss your commercial challenges, joint venture controls, or fiscal
          regime questions directly with Finergetics advisory partners.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 text-red-700 text-xs leading-relaxed animate-in fade-in">
          {errorMessage}
        </div>
      )}

      {/* Grid: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="lead-name"
            className="block text-xs font-bold text-navy-950"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="lead-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adebayo Adeleke"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-silver-400/40 focus:border-royal-600 focus:ring-2 focus:ring-royal-600/10 text-xs sm:text-sm text-navy-950 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="lead-email"
            className="block text-xs font-bold text-navy-950"
          >
            Work Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="lead-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-silver-400/40 focus:border-royal-600 focus:ring-2 focus:ring-royal-600/10 text-xs sm:text-sm text-navy-950 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid: Phone & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="lead-phone"
            className="block text-xs font-bold text-navy-950"
          >
            Direct Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="lead-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 803 ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-silver-400/40 focus:border-royal-600 focus:ring-2 focus:ring-royal-600/10 text-xs sm:text-sm text-navy-950 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="lead-company"
            className="block text-xs font-bold text-navy-950"
          >
            Organization / JV Operator
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="lead-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company or Energy Asset Name"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-silver-400/40 focus:border-royal-600 focus:ring-2 focus:ring-royal-600/10 text-xs sm:text-sm text-navy-950 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid: Advisory Area & Preferred Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="lead-interest"
            className="block text-xs font-bold text-navy-950"
          >
            Advisory Focus
          </label>
          <select
            id="lead-interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/40 focus:border-royal-600 focus:ring-2 focus:ring-royal-600/10 text-xs sm:text-sm text-navy-950 bg-white outline-none transition-all"
          >
            {ADVISORY_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="lead-timing"
            className="block text-xs font-bold text-navy-950"
          >
            Preferred Scheduling
          </label>
          <select
            id="lead-timing"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/40 focus:border-royal-600 focus:ring-2 focus:ring-royal-600/10 text-xs sm:text-sm text-navy-950 bg-white outline-none transition-all"
          >
            {TIMING_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message textarea */}
      <div className="space-y-1.5">
        <label
          htmlFor="lead-message"
          className="block text-xs font-bold text-navy-950"
        >
          Context or Strategic Objective (Optional)
        </label>
        <textarea
          id="lead-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Briefly outline your key objective, timeline, or specific operational challenge..."
          className="w-full p-3.5 rounded-xl border border-silver-400/40 focus:border-royal-600 focus:ring-2 focus:ring-royal-600/10 text-xs sm:text-sm text-navy-950 outline-none transition-all resize-y"
        />
      </div>

      {/* Guarantee & Submit */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-silver-400/20">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Lock className="w-3.5 h-3.5 text-royal-600 shrink-0" />
          <span>Strict Confidentiality & NDA Standards Upheld</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-royal-600 hover:bg-royal-700 active:scale-95 text-white font-ui font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Request...</span>
            </>
          ) : (
            <>
              <span>Schedule Advisory Discussion</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
