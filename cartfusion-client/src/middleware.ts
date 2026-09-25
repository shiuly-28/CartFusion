import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ১. পাবলিক রুটসমূহ (PageSpeedBot ও সাধারণ ভিজিটরদের সরাসরি ঢুকতে দেওয়া হবে)
  const publicRoutes = [
    "/",
    "/shop",
    "/shopDetails",
    "/category",
    "/login",
    "/register",
  ]

  // পাবলিক রুটে থাকলে সরাসরি অ্যাক্সেস করতে দাও
  const isPublicRoute = publicRoutes.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // ২. প্রোটেক্টেড রুট চেক (এখানে কুকি বা সেশন চেক করা হবে)
  const protectedRoutes = ["/profile", "/orders", "/cart", "/checkout", "/admin"]
  const isProtectedRoute = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  )

  // Auth.js / NextAuth Session Cookie চেক
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value

  // সেশন না থাকলে প্রোটেক্টেড রুটে ঢুকতে চাইলে রিডাইরেক্ট হবে
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