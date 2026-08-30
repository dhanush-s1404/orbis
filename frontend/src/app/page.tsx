"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-lg text-zinc-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <section className="mb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block mb-6 px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium tracking-widest uppercase">
                Build. Sell. Grow. Powered by AI.
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                Create stunning websites<br />
                and grow your business
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-8 max-w-xl">
                ORBIS is the AI operating system for building and selling online. Design,
                launch, and manage professional websites and online stores with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="/build"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-8 text-white transition-colors hover:bg-orange-500 font-medium"
                >
                  <span className="iconify" icon="lucide:build-square" width={24} height={24} />
                  Build My Website
                </a>
                <a
                  href="/templates"
                  className="flex h-14 w-full items-center justify-center rounded-full border border-orange-600 px-8 text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:border-orange-400 font-medium"
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
        <section className="mb-24 grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border">
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Website builder"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Website Builder</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Drag-and-drop website builder with responsive preview, undo/redo, and
              publish capabilities.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border">
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="E-commerce"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">E-commerce Store</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Complete store builder with product management, cart, checkout, and
              order tracking.
            </p>
          </div>
        </section>

        {/* AI Section */}
        <section className="mb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="AI generation"
                width={500}
                height={400}
                className="rounded-2xl overflow-hidden shadow-2xl"
              />
              <div className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center">
                <span className="text-white text-sm font-medium">✨ AI Generation</span>
              </div>
            </div>
            <div>
              <span className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium tracking-widest uppercase">
                AI Powered
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                Let AI build your website
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-8">
                Describe your business and let our AI generate a complete website with
                sections, content, and design in minutes.
              </p>
              <a
                href="/build"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-white font-medium transition-colors hover:bg-orange-500"
              >
                <span className="iconify" icon="lucide:magic-wand" width={20} height={20} />
                Build with AI
              </a>
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="mb-24">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8">Trusted by thousands of businesses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-800 text-lg font-bold">1</span>
                </div>
                <div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    "ORBIS transformed our online presence. The AI generation saved us
                    weeks of design work."
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                    — Sarah J., Marketing Director
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-800 text-lg font-bold">2</span>
                </div>
                <div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    "The best website builder I've used. Professional results without
                    the professional price tag."
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                    — Mike T., Small Business Owner
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-800 text-lg font-bold">3</span>
                </div>
                <div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    "Finally a platform that combines design flexibility with e-commerce
                    power."
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                    — Agency Partner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-24 bg-orange-50 dark:bg-orange-900/80 rounded-2xl p-8 border border-orange-200/20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium tracking-widest uppercase mb-6">
              Start building today
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
              Join thousands of successful online businesses
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8">
              Ready to create your professional website or online store?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/build"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-8 text-white transition-colors hover:bg-orange-500 font-medium"
              >
                <span className="iconify" icon="lucide:build-square" width={24} height={24} />
                Build My Website
              </a>
              <a
                href="/pricing"
                className="flex h-14 w-full items-center justify-center rounded-full border border-orange-600 px-8 text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:border-orange-400 font-medium"
              >
                View Pricing
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

interface ProductCardProps {
  name: string
  price: string
  description: string
  href?: string
}

function ProductCard({
  name,
  price,
  description,
  href = "/product/1",
}: ProductCardProps) {
  return (
    <div className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border">
      <div className="relative h-64">
        <Image
          src="/placeholder.svg?height=300&width=400"
          alt={name}
          className="object-cover w-full h-full duration-transform group-hover:scale-105 transition-transform"
          width={400}
          height={300}
        />
        <span
          className="absolute top-3 left-3 bg-orange-600 text-xs text-white px-2 rounded"
        >
          {price}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-base font-medium text-zinc-900 group-hover:text-orange-600 transition-colors mb-1">
          {name}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2">
          {description}
        </p>

        <div className="mt-4">
          <Link
            href={href}
            className="block w-full bg-orange-600 text-white font-medium py-2 rounded-md hover:bg-orange-500 transition-colors text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}