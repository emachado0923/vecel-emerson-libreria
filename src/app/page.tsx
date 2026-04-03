export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { Badge } from '@/components/ui/badge'
import { Library, Users, BookOpen, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button-variants'

async function getStats() {
  const [totalBooks, availableBooks, activeLoans, totalUsers] = await Promise.all([
    db.book.count(),
    db.book.count({ where: { copiesAvailable: { gt: 0 } } }),
    db.transaction.count({ where: { status: 'ACTIVE' } }),
    db.user.count(),
  ])
  return { totalBooks, availableBooks, activeLoans, totalUsers }
}

async function getFeaturedBooks() {
  return db.book.findMany({
    where: { copiesAvailable: { gt: 0 } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })
}

async function getPopularBooks() {
  return db.book.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { id: true, title: true, author: true, category: true, copiesAvailable: true, copiesTotal: true },
  })
}

const COVER_GRADIENTS = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-emerald-400 to-emerald-600',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-amber-600',
  'from-cyan-400 to-cyan-600',
]

const STAT_CARDS = [
  {
    key: 'totalBooks' as const,
    label: 'Total Books',
    icon: Library,
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'totalUsers' as const,
    label: 'Users',
    icon: Users,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'activeLoans' as const,
    label: 'Active Loans',
    icon: TrendingUp,
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'availableBooks' as const,
    label: 'Available',
    icon: BookOpen,
    bg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-400',
  },
]

export default async function Home() {
  const [stats, featuredBooks, popularBooks, session] = await Promise.all([
    getStats(),
    getFeaturedBooks(),
    getPopularBooks(),
    getSession(),
  ])

  const userName = session?.user?.name ?? session?.user?.email ?? 'User'
  const userImage = session?.user?.image ?? null

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">{userName.split(' ')[0]}!</span>
          </span>
          <div className="h-9 w-9 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 ring-2 ring-border">
            {userImage ? (
              <Image src={userImage} alt={userName} width={36} height={36} className="object-cover" />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {userName[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, bg, iconColor }) => (
          <div key={key} className="bg-card rounded-xl border shadow-sm p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats[key].toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured Books</h2>
          <Link href="/books" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredBooks.map((book, i) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <div className="bg-card rounded-xl border shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                {/* Cover placeholder */}
                <div className={`h-20 w-16 rounded-lg bg-gradient-to-br ${COVER_GRADIENTS[i % COVER_GRADIENTS.length]} shrink-0 flex items-center justify-center`}>
                  <BookOpen className="h-7 w-7 text-white/80" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-semibold line-clamp-1">{book.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">Author: {book.author}</p>
                  <p className="text-sm text-muted-foreground">Category: {book.category}</p>
                  <div className="pt-1">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Status: {book.copiesAvailable > 0 ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <Badge
                    variant={book.copiesAvailable > 0 ? 'default' : 'secondary'}
                    className={book.copiesAvailable > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100' : ''}
                  >
                    {book.copiesAvailable}/{book.copiesTotal} copies
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Right Now */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold">Popular Right Now</h2>
        </div>
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Author</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Category</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {popularBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-5 py-3 font-medium">
                      <Link href={`/books/${book.id}`} className="hover:text-primary hover:underline line-clamp-1">
                        {book.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{book.author}</td>
                    <td className="px-5 py-3">
                      <Badge variant="outline">{book.category}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        book.copiesAvailable > 0
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {book.copiesAvailable}/{book.copiesTotal} available
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
