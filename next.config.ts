import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const publicContentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://widget.cloudinary.com https://upload-widget.cloudinary.com https://*.cloudinary.com`.replace(
    /\s+/g,
    " ",
  ),
  "frame-src 'self' https://www.google.com/recaptcha/ https://widget.cloudinary.com https://upload-widget.cloudinary.com https://*.cloudinary.com",
  `connect-src 'self' ${isDev ? "ws: wss: http: https:" : "https://api.cloudinary.com https://*.cloudinary.com https://res.cloudinary.com https://upload-widget.cloudinary.com https://www.google.com/recaptcha/"}`.replace(
    /\s+/g,
    " ",
  ),
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: publicContentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
