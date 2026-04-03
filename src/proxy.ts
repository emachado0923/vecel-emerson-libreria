import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check for either auth system: custom cookie or NextAuth session token
  // NextAuth v5 (Auth.js) uses 'authjs.session-token' (http) and '__Secure-authjs.session-token' (https)
  // NextAuth v4 uses 'next-auth.session-token' and '__Secure-next-auth.session-token'
  const hasCustomSession = request.cookies.has('session-user')
  const hasNextAuthSession =
    request.cookies.has('authjs.session-token') ||
    request.cookies.has('__Secure-authjs.session-token') ||
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token')

  if (!hasCustomSession && !hasNextAuthSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
