import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/", "/pricing", "/login", "/register", "/forgot-password"];

function isPublicRoute(pathname: string): boolean {
  return (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/companies-house") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/api/agreements/template") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/public"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for session token (NextAuth v5 uses authjs.session-token)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images|animations|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.png$|.*\\.gif$|.*\\.mp4$|.*\\.webp$|.*\\.ico$).*)"],
};
