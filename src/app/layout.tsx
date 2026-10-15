import type { Metadata } from "next";
import { Archivo_Black, Open_Sans, Outfit } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { cn } from "@/lib/utils";
import "./globals.css";

const displayFont = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const uiFont = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const bodyFont = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finergetics Consulting Limited — Risk, Performance & Value",
  description:
    "Helping businesses control risk, improve performance, and increase value. Independent advisory for oil & gas operators, JV partners, energy investors, and infrastructure institutions.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "h-full antialiased scroll-smooth",
        displayFont.variable,
        uiFont.variable,
        bodyFont.variable,
      )}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-body bg-background text-foreground antialiased selection:bg-sky-100 selection:text-navy-950 overflow-x-hidden max-w-full"
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
