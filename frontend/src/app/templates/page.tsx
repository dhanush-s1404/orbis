"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Template {
  id: string
  name: string
  category: string
  price: string
  description: string
  previewUrl: string
  isFree: boolean
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch templates from backend or use mock data
    fetch("/api/templates", {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data) => {
        setTemplates(data.templates)
        const uniqueCategories = ["All", ...new Set(data.templates.map((t) => t.category))]
        setCategories(uniqueCategories)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        // Use mock templates if backend doesn't have them
        const mockTemplates: Template[] = [
          {
            id: "1",
            name: "Business Pro",
            category: "Business",
            price: "₹14,999",
            description: "Full business website with CMS",
            previewUrl: "/placeholder.svg?height=400&width=560",
            isFree: false,
          },
          {
            id: "2",
            name: "Portfolio Studio",
            category: "Portfolio",
            price: "₹8,999",
            description: "Professional portfolio website",
            previewUrl: "/placeholder.svg?height=400&width=560",
            isFree: false,
          },
          {
            id: "3",
            name: "E-commerce Store",
            category: "E-commerce",
            price: "₹19,999",
            description: "Complete online store with payments",
            previewUrl: "/placeholder.svg?height=400&width=560",
            isFree: false,
          },
          {
            id: "4",
            name: "Agency Landing",
            category: "Agency",
            price: "₹12,999",
            description: "Agency showcase website",
            previewUrl: "/placeholder.svg?height=400&width=560",
            isFree: false,
          },
          {
            id: "5",
            name: "Restaurant Menu",
            category: "Restaurant",
            price: "₹10,999",
            description: "Restaurant website with menu",
            previewUrl: "/placeholder.svg?height=400&width=560",
            isFree: false,
          },
          {
            id: "6",
            name: "Personal Blog",
            category: "Blog",
            price: "Free",
            description: "Personal blog website",
            previewUrl: "/placeholder.svg?height=400&width=560",
            isFree: true,
          },
        ]
        setTemplates(mockTemplates)
        setCategories(["All", "Business", "Portfolio", "E-commerce", "Agency", "Restaurant", "Blog"])
        setLoading(false)
      })
  }, [])

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category)
  }

  if (loading) {
    return (
      <div className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-zinc-600">Loading templates...</p>
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
    <main className="min-h-screen">
      <nav className="border-b border-zinc-200 bg-white dark:bg-zinc-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-orange-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="3" y1="15" x2="21" y2="15"></line>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
            Orbis Templates
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1 rounded text-sm ${selectedCategory === "All" ? "bg-orange-100 text-orange-600" : "text-zinc-600 hover:text-zinc-900 transition-colors"}`}
            >
              All
            </button>
            {categories.map((cat) => {
              if (cat === "All") return null
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3 py-1 rounded text-sm ${selectedCategory === cat ? "bg-orange-100 text-orange-600" : "text-zinc-600 hover:text-zinc-900 transition-colors"}`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates
            .filter((t) => selectedCategory === "All" || t.category === selectedCategory)
            .map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border"
              >
                <div className="relative h-64">
                  <Image
                    src={template.previewUrl}
                    alt={template.name}
                    className="object-cover w-full h-full duration-slow"
                    width={560}
                    height={400}
                  />
                  <span
                    className="absolute top-3 left-3 bg-orange-600 text-xs text-white px-2 rounded"
                  >
                    {template.isFree ? "FREE" : template.price}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-medium text-zinc-900 mb-1">{template.name}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2">{template.description}</p>
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/product/1`}
                      className="flex-1 py-2 px-3 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-500 transition-colors"
                    >
                      Preview
                    </Link>
                    <button
                      className="py-2 px-3 text-orange-600 text-sm font-medium rounded border border-orange-600 hover:bg-orange-100 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  )
}