
import type { NextRequest } from 'next/server'
 

export function proxy(req: NextRequest) {
 
}
 

 
export const config = {
  matcher: '/about/:path*',
}