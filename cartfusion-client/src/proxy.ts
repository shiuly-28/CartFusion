import { NextResponse, type NextRequest } from 'next/server'
import { auth } from './auth'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. NextAuth-এর ইন্টারনাল API রাউটসমূহকে বাইপাস করা (খুবই গুরুত্বপূর্ণ)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // 2. পাবলিক রাউটসমূহ
  const publicRoutes = ['/', '/shop', '/shopDetails', '/category', '/login', '/register']
  if (publicRoutes.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next()
  }

  // 3. প্রোটেক্টেড রাউট সিকিউরিটি চেক
  const session = await auth()
  if (!session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}