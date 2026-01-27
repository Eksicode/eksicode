import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const path = req.nextUrl.pathname;
  
  // Skip middleware for API routes and NextAuth internal routes
  if (path.startsWith("/api/") || path.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!session && (path.startsWith("/profile") || path.startsWith("/dashboard"))) {
    return NextResponse.redirect(new URL("/auth/uye-giris", req.url));
  }

  // Handle profile/dashboard routes - require any authenticated user
  if (path.startsWith("/profile") || path.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/uye-giris", req.url));
    }
  }

  // Redirect authenticated users away from auth pages (except logout)
  if (session && path.startsWith("/auth/") && !path.includes("/uye-cikis")) {
    // Redirect to profile for all authenticated users
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/auth/:path*"],
};
