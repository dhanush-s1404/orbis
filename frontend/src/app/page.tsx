"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/products?limit=6", {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(() => {
        setError(null)
        setLoaded(true)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load featured websites")
        setLoaded(true)
      })
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-500 text-base tracking-wider mb-8">
            ORBIS is initializing...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-500 text-base tracking-wider mb-8">
            Failed to load featured websites
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 py-24 relative">
        {/* Background floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-6 -left-6 w-64 h-64 rounded-3xl bg-violet-500/10 blur-3xl animate-float-slow"
          ></div>
          <div
            className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-indigo-500/10 blur-2xl animate-float"
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-cyan-500/10 blur-xl animate-blob"
          ></div>
        </div>

        {/* Hero Section */}
        <section className="mb-24 lg:mb-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span
                className="inline-block mb-6 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium tracking-widest uppercase"
              >
                Build. Sell. Grow. Powered by AI.
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-zinc-950 dark:text-zinc-50 mb-8">
                Create stunning websites <span className="animate-fade-in-up">and grow your business</span>
              </h1>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed mb-8 max-w-xl">
                ORBIS is the AI operating system for building and selling online. Design,
                launch, and manage professional websites and online stores with ease. From
                landing pages to full e-commerce platforms, our AI handles the complex
                design work while you focus on your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up">
                <a
                  href="/build"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-8 text-white transition-colors hover:bg-orange-500 font-medium shadow-lg shadow-orange-500/20"
                >
                  <span className="iconify" icon="lucide:build-square" width={24} height={24} />
                  Build My Website
                </a>
                <a
                  href="/templates"
                  className="flex h-14 w-full items-center justify-center rounded-full border border-orange-400 px-8 text-orange-400 transition-colors hover:bg-orange-50 dark:text-orange-300 dark:hover:border-orange-300 font-medium shadow-lg shadow-orange-500/20"
                >
                  <span className="iconify" icon="lucide:grid" width={24} height={24} />
                  Explore Templates
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="ORBIS website builder preview"
                width={600}
                height={500}
                className="rounded-2xl overflow-hidden shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Preview Section */}
        <section className="mb-24 lg:mb-32 relative">
          <div className="grid grid-cols-2 gap-6">
            <div
              className="bg-white dark:bg-zinc-900/30 rounded-2xl p-8 backdrop-blur-sm border border-border/50 hover:shadow-xl hover:shadow-orange-500/20 transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-orange-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Website Builder</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed">
                Drag-and-drop website builder with responsive preview, undo/redo, and
                publish capabilities. Create professional sites without writing code.
              </p>
            </div>
            <div
              className="bg-white dark:bg-zinc-900/30 rounded-2xl p-8 backdrop-blur-sm border border-border/50 hover:shadow-xl hover:shadow-purple-500/20 transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21l-4-4a4 4 0 0 0-5.66-1.18L3 22l1.95-4.94a4 4 0 0 0 1.23-5.77l6.16 2.16a4 4 0 0 0 2.72 0l6.16 2.16a4 4 0 0 0 1.23-5.77L21 22l-4.94 1.95a4 4 0 0 0-1.18 5.66l-4 4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">E-commerce Store</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed">
                Complete store builder with product management, cart, checkout, and
                order tracking. Sell products online with secure payments.
              </p>
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section className="mb-24 lg:mb-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium tracking-widest uppercase"
              >
                AI Powered
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight text-zinc-950 dark:text-zinc-50 mb-6">
                Let AI build your website
              </h2>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed mb-8">
                Describe your business and let our AI generate a complete website with
                sections, content, and design in minutes. Just tell us about your
                business, style preferences, and goals - and watch ORBIS create
                something extraordinary.
              </p>
              <a
                href="/build"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-white font-medium transition-colors hover:bg-orange-500 shadow-lg shadow-orange-500/20"
              >
                <span className="iconify" icon="lucide:magic-wand" width={20} height={20} />
                Build with AI
              </a>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="AI website generation"
                width={500}
                height={400}
                className="rounded-2xl overflow-hidden shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="mb-24 lg:mb-32 relative">
          <div className="bg-white dark:bg-zinc-900/30 rounded-2xl p-8 backdrop-blur-sm border border-border/50">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8">Trusted by thousands of businesses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-lg font-bold">1</span>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    ORBIS transformed our online presence. The AI generation saved us
                    weeks of design work.
                  </p>
                  <p className="text-zinc-400 dark:text-zinc-400 text-sm mt-2">
                    — Sarah J., Marketing Director
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-lg font-bold">2</span>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    The best website builder I used. Professional results without
                    the professional price tag.
                  </p>
                  <p className="text-zinc-400 dark:text-zinc-400 text-sm mt-2">
                    — Mike T., Small Business Owner
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-lg font-bold">3</span>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Finally a platform that combines design flexibility with e-commerce
                    power.
                  </p>
                  <p className="text-zinc-400 dark:text-zinc-400 text-sm mt-2">
                    — Agency Partner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-24 lg:mb-32 relative">
          <div
            className="bg-white dark:bg-zinc-900/30 rounded-2xl p-8 backdrop-blur-sm border border-border/50"
          >
            <div className="max-w-2xl mx-auto text-center">
              <span
                className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium tracking-widest uppercase mb-6"
              >
                Start building today
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight text-zinc-950 dark:text-zinc-100 mb-6">
                Join thousands of successful online businesses
              </h2>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg mb-8">
                Ready to create your professional website or online store?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/build"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-8 text-white transition-colors hover:bg-orange-500 font-medium shadow-lg shadow-orange-500/20"
                >
                  <span className="iconify" icon="lucide:build-square" width={24} height={24} />
                  Build My Website
                </a>
                <a
                  href="/pricing"
                  className="flex h-14 w-full items-center justify-center rounded-full border border-orange-600 px-8 text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-300 dark:hover:border-orange-300 font-medium shadow-lg shadow-orange-500/20"
                >
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}