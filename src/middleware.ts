import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutePrefixes = [
  "/dashboard",
  "/students",
  "/teachers",
  "/attendance",
  "/fees",
  "/admissions",
  "/reports",
  "/settings",
  "/api/secure",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) => nextUrl.pathname.startsWith(prefix));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!req.auth?.user) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const institutionId = req.auth.user.institutionId;
  const isSuperAdmin = req.auth.user.role === "SUPER_ADMIN";
  if (!institutionId && !isSuperAdmin) {
    return NextResponse.json({ error: "Tenant context is missing for this user." }, { status: 403 });
  }

  const requestHeaders = new Headers(req.headers);
  if (institutionId) {
    requestHeaders.set("x-institution-id", institutionId);
  }
  requestHeaders.set("x-user-role", req.auth.user.role);
  requestHeaders.set("x-user-id", req.auth.user.id);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
