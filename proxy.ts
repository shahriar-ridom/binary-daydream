import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isTryingToAccessAdmin = request.nextUrl.pathname.startsWith("/admin");

  if (isTryingToAccessAdmin) {
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
