import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth', '/api/books/metadata']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check all possible session cookie names across auth systems and environments
  const cookies = request.cookies
  const hasSession =
    cookies.has('session-user') ||                        // custom email/password login
    cookies.has('authjs.session-token') ||                // NextAuth v5 / Auth.js (HTTP)
    cookies.has('__Secure-authjs.session-token') ||       // NextAuth v5 / Auth.js (HTTPS)
    cookies.has('__Host-authjs.session-token') ||         // NextAuth v5 / Auth.js (strict)
    cookies.has('next-auth.session-token') ||             // NextAuth v4 (HTTP)
    cookies.has('__Secure-next-auth.session-token')       // NextAuth v4 (HTTPS)

  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
