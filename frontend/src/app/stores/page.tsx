"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/stores", {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data) => {
        setStores(data.stores)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load stores")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-zinc-600">Loading stores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              My Stores
            </h1>
            <p className="text-zinc-500">Manage your online stores</p>
          </div>
          <Link
            href="/build"
            className="py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors text-sm"
          >
            Create New Store
          </Link>
        </div>

        {error ? (
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6 text-zinc-800">
            <p>{error}</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-500">No stores yet</p>
            <p className="text-zinc-400 text-sm mt-2">Create your first store using the button above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border"
              >
                <div className="relative h-48">
                  <Image
                    src={store.backgroundImage || "/placeholder.svg?height=280&width=560"}
                    alt={store.name}
                    className="object-cover w-full h-full duration-slow"
                    width={560}
                    height={280}
                  />
                  <span
                    className="absolute top-3 left-3 bg-orange-600 text-xs font-medium text-white px-2 rounded"
                  >
                    {store.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                    {store.name}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2">
                    {store.description || "Your online store"}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/stores/${store.id}`}
                      className="flex-1 py-2 px-3 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-500 transition-colors"
                    >
                      Manage
                    </Link>
                    <button
                      className="py-2 px-2 text-orange-400 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v.01M12 12v.01M12 19v.01M17 12l-4.5-4.5L15 12l-4.5 4.5M9 12l4.5 4.5L5.5 12l4.5-4.5M2 9l7 7 7-7M19 15l2.286-2.286c.448-.448.448-1.17 0-1.618l-2.286-2.286c-.448-.448-1.172-.448-1.618 0L12 9.12l-6.856-1.528c-.448-.11-.892-.05-1.322.108a3.999 3.999 0 0 0-.61.85l.551 1.15a.75.75 0 0 1-.038.648l-.156.1z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}