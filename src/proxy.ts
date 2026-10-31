import { NextResponse, type NextRequest } from "next/server";
import { flags } from "@/lib/flags";

export function proxy(request: NextRequest) {
  if (flags.app) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/beck" || pathname.startsWith("/beck/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/beck", "/beck/:path*"],
};
