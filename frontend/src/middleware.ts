import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect unauthenticated users trying to access protected routes
    if (!token && path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/uye-giris", req.url));
    }

    // Redirect authenticated users away from auth pages (except logout)
    if (token && path.startsWith("/auth/") && !path.includes("/uye-cikis")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public auth pages
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }
        // Require authentication for dashboard
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        // Allow all other routes
        return true;
      },
    },
    pages: {
      signIn: "/auth/uye-giris",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
