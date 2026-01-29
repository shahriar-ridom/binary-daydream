import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/orders")) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const url = new URL("/sign-in", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/sign-in")) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      const url = new URL("/orders", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*", "/sign-in/:path*"],
};
