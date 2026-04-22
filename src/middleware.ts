import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Pass pathname to server components (e.g. admin login redirect `next`). */
export function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', req.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin/:path*'],
}
