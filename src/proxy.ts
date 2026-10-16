import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Unauthenticated protection: redirect unauthenticated requests away from protected admin routes
  if (pathname !== "/admin/login" && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 2. Canonical redirect: route bare /admin to /admin/dashboard for authenticated sessions
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 3. Generate cryptographic nonce for dynamic admin panel CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDev = process.env.NODE_ENV !== "production";

  const adminCsp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https://widget.cloudinary.com https://upload-widget.cloudinary.com https://*.cloudinary.com`.replace(
      /\s+/g,
      " ",
    ),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com",
    `connect-src 'self' ${isDev ? "ws: wss: http: https:" : "https://api.cloudinary.com https://*.cloudinary.com https://res.cloudinary.com https://upload-widget.cloudinary.com"}`.replace(
      /\s+/g,
      " ",
    ),
    "frame-src 'self' https://widget.cloudinary.com https://upload-widget.cloudinary.com https://*.cloudinary.com",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", adminCsp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", adminCsp);
  response.headers.set("x-nonce", nonce);

  return response;
}

// Strictly intercept /admin and any sub-routes, ignoring public routes
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
