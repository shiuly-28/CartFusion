import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl


  const publicRoutes = [
    "/",
    "/shop",
    "/shopDetails",
    "/category",
    "/login",
    "/register",
  ]

  const isPublicRoute = publicRoutes.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }


  const protectedRoutes = ["/profile", "/orders", "/cart", "/checkout", "/admin"]
  const isProtectedRoute = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  )

  // Auth.js / NextAuth Session Cookie 
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value

 
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js)$).*)",
  ],
}