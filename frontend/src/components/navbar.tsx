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
    <nav
      className="border-b border-border/50 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-xl sticky top-0 z-50"
      style={{
        background: "rgba(255, 255, 255, 0.8) !important",
        backdropFilter: "blur(20px)",
        "-webkit-backdrop-filter": "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-semibold text-orange-600 text-xl tracking-wider shadow-[0_2px_15px_rgba(255,107,0,0.3)]"
          >
            Orbis
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="relative text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            aria-label="Home"
          >
            Platform
          </Link>
          <Link
            href="/build"
            className="relative text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            aria-label="Build Website"
          >
            Build Website
          </Link>
          <Link
            href="/improve"
            className="relative text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            aria-label="Improve Website"
          >
            Improve Website
          </Link>
          <Link
            href="/templates"
            className="relative text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            aria-label="Templates"
          >
            Templates
          </Link>
          <Link
            href="/services"
            className="relative text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            aria-label="Services"
          >
            Services
          </Link>
          <Link
            href="/pricing"
            className="relative text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            aria-label="Pricing"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3 md:non">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-border/50 dark:hover:bg-zinc-900/50 transition-colors [&:focus-visible]:outline-none [&:focus-visible]:outline-2 [&:focus-visible]:outline-2border"
            aria-label="Open menu"
          >
            <svg
              className="w-5 h-5"
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
        <div
          className="fixed inset-0 z-40 bg-white/90 dark:bg-zinc-900/30 backdrop-blur overflow-y-auto"
        >
          <div className="flex flex-col h-full p-8 pt-16">
            <button
              onClick={toggleMenu}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-border/50 dark:hover:bg-zinc-900/50 transition-colors [&:focus-visible]:outline-none [&:focus-visible]:outline-2 [&:focus-visible]:outline-2border"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5"
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
              href="/"
              className="mb-4 font-semibold text-orange-600 text-xl tracking-wider shadow-[0_2px_15px_rgba(255,107,0,0.3)]"
            >
              Orbis
            </Link>
            <Link
              href="/build"
              className="mb-4 block py-3 px-4 rounded-xl bg-white/50 dark:bg-zinc-900/30 text-orange-600 font-medium hover:bg-white/60 dark:hover:bg-zinc-900/50 transition-colors"
            >
              Build Website
            </Link>
            <Link
              href="/improve"
              className="mb-4 block py-3 px-4 rounded-xl bg-white/50 dark:bg-zinc-900/30 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Improve Website
            </Link>
            <Link
href="/templates"
              className="mb-4 block py-3 px-4 rounded-xl bg-white/50 dark:bg-zinc-900/30 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Templates
            </Link>
            <Link
href="/services"
              className="mb-4 block py-3 px-4 rounded-xl bg-white/50 dark:bg-zinc-900/30 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Services
            </Link>
            <Link
href="/pricing"
              className="mb-4 block py-3 px-4 rounded-xl bg-white/50 dark:bg-zinc-900/30 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Pricing
            </Link>
            <div className="mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleSignIn}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-500 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-4 rounded-xl border border-orange-600 text-orange-600 font-medium hover:bg-orange-50 transition-colors mt-3"
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