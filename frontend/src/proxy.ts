import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Skip middleware for API routes and NextAuth internal routes
    if (path.startsWith("/api/") || path.startsWith("/_next/")) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users trying to access protected routes
    if (!token && (path.startsWith("/profile") || path.startsWith("/dashboard"))) {
      return NextResponse.redirect(new URL("/auth/uye-giris", req.url));
    }

    // Handle profile/dashboard routes - require any authenticated user
    if (path.startsWith("/profile") || path.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/uye-giris", req.url));
      }
    }

    // Redirect authenticated users away from auth pages (except logout)
    if (token && path.startsWith("/auth/") && !path.includes("/uye-cikis")) {
      // Redirect to profile for all authenticated users
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Allow access to public auth pages
        if (path.startsWith("/auth/")) {
          return true;
        }
        
        // Allow public routes
        if (!path.startsWith("/profile") && !path.startsWith("/dashboard")) {
          return true;
        }
        
        // Require authentication for protected routes
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/uye-giris",
    },
  }
);

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/auth/:path*"],
};
