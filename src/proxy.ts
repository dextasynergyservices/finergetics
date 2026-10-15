import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never intercept the login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // If unauthenticated, redirect bare /admin or any /admin/* route to /admin/login
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // If authenticated and visiting bare /admin, route to the dashboard
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Strictly intercept /admin and any sub-routes, ignoring public routes
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
