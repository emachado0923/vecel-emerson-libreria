import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'LIBRARIAN' | 'ADMIN'
  image?: string | null
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  // 1. NextAuth session (Google / GitHub OAuth) — checked FIRST so it always
  //    takes priority over any stale custom cookie left from a previous login.
  const nextAuthSession = await auth()
  if (nextAuthSession?.user?.id) {
    return {
      user: {
        id: nextAuthSession.user.id as string,
        email: nextAuthSession.user.email ?? '',
        name: nextAuthSession.user.name ?? null,
        role: (nextAuthSession.user.role as SessionUser['role']) ?? 'USER',
        image: nextAuthSession.user.image ?? null,
      },
    }
  }

  // 2. Custom cookie (email / password login) — fallback when no OAuth session
  const cookieStore = await cookies()
  const raw = cookieStore.get('session-user')?.value
  if (raw) {
    try {
      const user = JSON.parse(raw) as SessionUser
      if (user?.id && user?.role) return { user }
    } catch {
      // malformed cookie, ignore
    }
  }

  return null
}
