"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [loading, setLoading] = useState(true)
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
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load featured websites")
        setLoading(false)
      })
  }, [])

  if (loading) {
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
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center justify-between py-24 px-16 w-full max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.2] tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
            Build a better website.
          </h1>

          <p className="max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
            Improve the one you already have. Create a website from scratch,
            transform an existing website, or let Orbis build exactly what your
            business needs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="/build"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-8 text-white transition-colors hover:bg-orange-500"
          >
            <span
              className="iconify"
              icon="lucide:build-square"
              width={24}
              height={24}
            />
            Build My Website
          </a>

          <a
            href="/improve"
            className="flex h-14 w-full items-center justify-center rounded-full border border-orange-600 px-8 text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:border-orange-400"
          >
            Improve My Website
          </a>

          <a
            href="/templates"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 text-white transition-colors hover:bg-zinc-800"
          >
            <span
              className="iconify"
              icon="lucide:grid"
              width={24}
              height={24}
            />
            Explore Templates
          </a>
        </div>
      </div>

      <div className="mt-16 w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            name="Business Pro"
            price="₹14,999"
            description="Full business website with CMS"
          />

          <ProductCard
            name="Portfolio Studio"
            price="₹8,999"
            description="Professional portfolio website"
          />

          <ProductCard
            name="E-commerce Store"
            price="₹19,999"
            description="Complete online store with payments"
          />
        </div>
      </div>
    </main>
  )
}

interface ProductCardProps {
  name: string
  price: string
  description: string
}

function ProductCard({
  name,
  price,
  description,
}: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border">
      <div className="p-6">
        <h3 className="text-xl font-medium text-zinc-900 mb-2">
          {name}
        </h3>

        <p className="text-zinc-500 text-sm mb-3">
          {description}
        </p>

        <p className="text-zinc-900 font-medium mb-3">
          {price}
        </p>

        <Link
          href="/product/1"
          className="block w-full bg-orange-600 text-white font-medium py-2 rounded-md hover:bg-orange-500 transition-colors text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}