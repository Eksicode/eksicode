import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const userRoles = token?.roles || [];

    // Helper function to check if user has required role
    const hasRole = (roles: string[]) => roles.some(role => userRoles.includes(role));

    // Redirect unauthenticated users trying to access protected routes
    if (!token && (path.startsWith("/admin") || path.startsWith("/profile") || path.startsWith("/dashboard"))) {
      return NextResponse.redirect(new URL("/auth/uye-giris", req.url));
    }

    // Handle admin routes - require admin or superadmin role
    if (path.startsWith("/admin")) {
      if (!hasRole(["admin", "superadmin"])) {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
    }

    // Handle profile/dashboard routes - require any authenticated user
    if (path.startsWith("/profile") || path.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/uye-giris", req.url));
      }
    }

    // Redirect authenticated users away from auth pages (except logout)
    if (token && path.startsWith("/auth/") && !path.includes("/uye-cikis")) {
      // Redirect based on user role
      if (hasRole(["admin", "superadmin"])) {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
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
        if (!path.startsWith("/admin") && !path.startsWith("/profile") && !path.startsWith("/dashboard")) {
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
  matcher: ["/admin/:path*", "/profile/:path*", "/dashboard/:path*", "/auth/:path*"],
};
