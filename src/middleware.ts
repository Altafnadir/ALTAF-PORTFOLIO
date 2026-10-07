import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never match /admin or /api
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If user has saved altaf_lang cookie, sync it to NEXT_LOCALE so next-intl respects it
  const savedLang = request.cookies.get("altaf_lang")?.value;
  if (
    savedLang &&
    ["en", "es", "de"].includes(savedLang) &&
    !request.cookies.get("NEXT_LOCALE")
  ) {
    request.cookies.set("NEXT_LOCALE", savedLang);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all request paths except api, admin, _next, _vercel, and static assets
  matcher: [
    "/",
    "/(en|es|de)/:path*",
    "/((?!api|_next|_vercel|admin|projects|images|favicon.ico|.*\\..*).*)",
  ],
};
