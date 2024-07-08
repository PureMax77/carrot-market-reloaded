import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/") {
    const response = NextResponse.next(); // 다음단계(응답)으로 넘어가계하는 트리거 역활
    response.cookies.set("middleware-cookie", "hello!");
    return response;
  }

  if (pathname === "/profile") {
    return Response.redirect(new URL("/", request.url));
  }
}

export const config = {
  // page 요청 뿐만 아니라 api, static 등등 모든 요청을 통과하므로 아래 것들을 제외하라는 정규식
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
