import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  // Get the Session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "admin") {
      // Redirect to home or sign-in
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Protect Customer Routes
  if (pathname.startsWith("/orders")) {
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*"],
};
