"use client"

import Link from "next/link"

interface NavItem {
  id: string
  label: string
  href: string
  isExternal?: boolean
}

interface NavbarProps {
  navItems: NavItem[]
  logo?: string
  logoHref?: string
}

export function Navbar({ navItems, logo, logoHref }: NavbarProps) {
  return (
    <nav className="bg-white dark:bg-zinc-800 border-b border-zinc-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {logoHref && (
            <Link
              href={logoHref}
              className="flex items-center gap-2"
            >
              {logo ? (
                <span className="text-2xl font-bold text-orange-600">
                  {logo}
                </span>
              ) : (
                <span className="hidden w-6 h-6" />
              )}
              ORBIS
            </Link>
          )}

          <div className="hidden md:block flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-zinc-700 dark:text-zinc-300 hover:text-orange-600 transition-colors text-sm font-medium`}
                onClick={item.isExternal ? undefined : (e: React.MouseEvent) => e.preventDefault()}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 hidden md:block">
            <Link
              href="/dashboard/projects"
              className="px-4 py-2 text-sm text-orange-600 bg-orange-100 rounded-full"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}