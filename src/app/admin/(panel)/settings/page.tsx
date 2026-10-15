export const instant = false;

import { SettingsEditor } from "@/components/admin/modules/settings-editor";
import type { SiteSettingsData } from "@/lib/schemas/settings";
import { requireAdmin } from "@/server/auth/guard";
import { getAdminSiteSettings } from "@/server/queries/admin";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const rawSettings = await getAdminSiteSettings();

  // Fallback defaults if table row is empty
  const initialSettings: SiteSettingsData =
    (rawSettings as SiteSettingsData) || {
      general: {
        siteName: "Finergetics Consulting Limited",
        tagline: "Consulting Limited",
        brandLine:
          "Helping businesses control risk, improve performance, and increase value.",
        missionStatement:
          "We help organisations strengthen financial controls, optimise commercial decisions, improve operational performance, and manage risk.",
        defaultSeoTitle:
          "Finergetics Consulting Limited — Risk, Performance & Value",
        defaultSeoDescription:
          "Helping businesses control risk, improve performance, and increase value. Independent energy & financial advisory.",
      },
      contact: {
        email: "info@finergetics.com",
        phone1: "+234 803 754 1083",
        phone2: "+234 810 040 3013",
        businessHours: "Mon – Fri: 8:00 AM – 6:00 PM (WAT / GMT+1)",
        address: "Lagos, Nigeria",
      },
      social: {
        linkedin: "https://linkedin.com/company/finergetics",
        twitter: "",
      },
      navigation: {
        header: [
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Services", href: "/services" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Insights", href: "/blog" },
          { label: "Book a Call", href: "/book-a-call" },
        ],
        footerSections: [],
      },
      security: {
        recaptchaThreshold: 50,
      },
    };

  return <SettingsEditor initialSettings={initialSettings} />;
}
