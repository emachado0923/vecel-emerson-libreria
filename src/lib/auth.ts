import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export const { auth, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as any,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { id: true, role: true },
        })
        token.id = dbUser?.id ?? user.id
        token.role = dbUser?.role ?? 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as any
      }
      return session
    },
  },
})
