import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session");

  // Proteksi rute admin & profil
  const isProtectedRoute = pathname.startsWith("/admin") || pathname.startsWith("/profile");
  
  // Kecualikan halaman login admin khusus (/admin/login) dari proteksi admin biasa
  const isHoldingAdminLogin = pathname === "/admin/login";

  if (isProtectedRoute && !isHoldingAdminLogin && !session) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
