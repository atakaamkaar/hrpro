import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

// Route protection lives here rather than checking inside every page, so the
// rule "who can see /admin and /dashboard" is in exactly one place. This can
// only check "is there a session cookie at all" (middleware runs on the Edge
// runtime and can't query Prisma/SQLite) — role and expiry are re-checked
// with a real database read inside each protected page via getCurrentUser().
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
