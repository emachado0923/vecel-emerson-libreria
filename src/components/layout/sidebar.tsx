'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Home, Library, BookOpen, Bot, Sparkles, LogOut,
  ChevronLeft, ChevronRight, BarChart3, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home, roles: ['USER', 'LIBRARIAN', 'ADMIN'] },
  { href: '/books', label: 'Catalog', icon: Library, roles: ['USER', 'LIBRARIAN', 'ADMIN'] },
  { href: '/my-loans', label: 'My Loans', icon: BookOpen, roles: ['USER', 'LIBRARIAN', 'ADMIN'] },
  { href: '/assistant', label: 'AI Assistant', icon: Bot, roles: ['USER', 'LIBRARIAN', 'ADMIN'] },
  { href: '/recommendations', label: 'Recommendations', icon: Sparkles, roles: ['USER', 'LIBRARIAN', 'ADMIN'] },
  { href: '/admin', label: 'Admin Panel', icon: BarChart3, roles: ['LIBRARIAN', 'ADMIN'] },
]

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  userRole: string
  userName: string | null
  userImage: string | null
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, userRole, userName, userImage }: SidebarProps) {
  const pathname = usePathname()
  const visibleItems = navItems.filter((item) => item.roles.includes(userRole))
  const initials = userName ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?'

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen border-r bg-card flex flex-col
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4 shrink-0">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setMobileOpen(false)}>
            <Library className="h-6 w-6 text-primary shrink-0" />
            <span>LibraryOS</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto" onClick={() => setMobileOpen(false)}>
            <Library className="h-6 w-6 text-primary" />
          </Link>
        )}

        {/* Desktop collapse button */}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden lg:flex"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-3 space-y-2 shrink-0">
        {/* User info */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-muted/50">
            <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center">
              {userImage ? (
                <Image src={userImage} alt={userName ?? 'User'} width={32} height={32} className="object-cover" />
              ) : (
                <span className="text-xs font-semibold text-primary">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{userName ?? 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()}</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center" title={userName ?? 'User'}>
              {userImage ? (
                <Image src={userImage} alt={userName ?? 'User'} width={32} height={32} className="object-cover" />
              ) : (
                <span className="text-xs font-semibold text-primary">{initials}</span>
              )}
            </div>
          </div>
        )}

        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <span className="text-xs text-muted-foreground">Theme</span>}
          <ThemeToggle />
        </div>

        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-8 hidden lg:flex"
            onClick={() => setCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        <Link
          href="/login"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  )
}
