"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignIn = () => {
    router.signIn("/auth/signin")
  }

  const handleGetStarted = () => {
    router.push("/build")
  }

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <nav className="border-b border-zinc-200 bg-white dark:bg-zinc-900/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-semibold text-orange-600 text-xl tracking-wider"
          >
            Orbis
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-label="Home"
          >
            Platform
          </Link>
          <Link
            href "/build"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-label="Build Website"
          >
            Build Website
          </Link>
          <Link
            href "/improve"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-label="Improve Website"
          >
            Improve Website
          </Link>
          <Link
            href "/templates"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-label="Templates"
          >
            Templates
          </Link>
          <Link
            href "/services"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-label="Services"
          >
            Services
          </Link>
          <Link
            href "/pricing"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-label="Pricing"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-zinc-900/30 overflow-y-auto">
          <div className="flex flex-col h-full p-6">
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="18" x2="18" y2="6"></line>
              </svg>
            </button>

            <Link
              href "/"
              className="mb-4 font-semibold text-orange-600 text-lg tracking-wider"
            >
              Orbis
            </Link>
            <Link
              href "/build"
              className="mb-4 block py-3 px-2 text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Build Website
            </Link>
            <Link
              href "/improve"
              className="mb-4 block py-3 px-2 text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Improve Website
            </Link>
            <Link
              href "/templates"
              className="mb-4 block py-3 px-2 text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Templates
            </Link>
            <Link
              href "/services"
              className="mb-4 block py-3 px-2 text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Services
            </Link>
            <Link
              href "/pricing"
              className="mb-4 block py-3 px-2 text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Pricing
            </Link>
            <div className="mt-8 pt-8 border-t border-zinc-200">
              <button
                onClick={handleSignIn}
                className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-4 border border-orange-600 text-orange-600 font-medium rounded-md hover:bg-orange-50 transition-colors mt-3"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}