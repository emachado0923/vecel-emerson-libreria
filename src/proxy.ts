import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth']

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow email/password sessions (custom cookie)
  const hasCustomSession = request.cookies.has('session-user')

  if (!request.auth && !hasCustomSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
