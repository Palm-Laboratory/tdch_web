import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_LOGIN_PATH = "/admin/login";
const MAINTENANCE_PAGE_PATH = "/maintenance.html";
const MAINTENANCE_ENABLED_VALUES = new Set(["1", "true", "on", "yes"]);

const hasAdminIdentity = (token?: { email?: string | null; username?: string | null } | null) =>
  Boolean(token?.email?.trim() || token?.username?.trim());

function isMaintenanceModeEnabled() {
  const value = process.env.MAINTENANCE_MODE?.trim().toLowerCase();
  return value ? MAINTENANCE_ENABLED_VALUES.has(value) : false;
}

function shouldBypassMaintenance(pathname: string) {
  if (pathname === MAINTENANCE_PAGE_PATH) {
    return true;
  }

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return true;
  }

  return /\.[^/]+$/.test(pathname);
}

function continueWithCurrentPath(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isMaintenanceModeEnabled() && !shouldBypassMaintenance(pathname)) {
    return NextResponse.redirect(new URL(MAINTENANCE_PAGE_PATH, request.url));
  }

  if (!pathname.startsWith("/admin")) {
    return continueWithCurrentPath(request);
  }

  if (pathname === ADMIN_LOGIN_PATH) {
    return continueWithCurrentPath(request);
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (token?.role === "admin" && hasAdminIdentity(token)) {
    return continueWithCurrentPath(request);
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/:path*"],
};
