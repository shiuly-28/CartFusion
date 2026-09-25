import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      
      // Protected Routes
      const protectedRoutes = ['/profile', '/orders', '/cart', '/checkout', '/admin']
      const isProtectedRoute = protectedRoutes.some((path) => nextUrl.pathname.startsWith(path))

      if (isProtectedRoute) {
        if (isLoggedIn) return true
        return false // এটি অটোমেটিক /login এ রিডাইরেক্ট করবে
      }
      return true
    },
  },
  providers: [], // মূল auth.ts ফাইলে প্রোভাইডার দেওয়া হবে
} satisfies NextAuthConfig