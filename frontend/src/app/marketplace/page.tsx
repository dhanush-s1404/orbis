"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
  featuredProducts: any[]
}

interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  price: number | null
  discountPrice: number | null
  images: any[]
  features: any[]
  category: any
}

export default function Marketplace() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    category: "",
    search: "",
    sort: "latest",
  })

  useEffect(() => {
    fetchMarketplace()
  }, [])

  const fetchMarketplace = async () => {
    try {
      // Fetch categories first
      const catRes = await fetch("/api/categories", { cache: "no-store" })
      if (!catRes.ok) throw new Error("Failed to fetch categories")
      const catData = await catRes.json()
      setCategories(catData)

      // Fetch products with filters
      const params = new URLSearchParams()
      if (filter.category) params.append("category", filter.category)
      if (filter.search) params.append("search", filter.search)
      params.append("page", "1")
      params.append("limit", "12")
      params.append("sort", filter.sort)

      const prodRes = await fetch(`/api/products?${params}`, {
        cache: "no-store",
      })
      if (!prodRes.ok) throw new Error("Failed to fetch products")
      const prodData = await prodRes.json()
      setProducts(prodData.products)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load marketplace. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target
    setFilter({
      ...filter,
      [name]: type === "checkbox" ? value : value,
    })
    if (type === "range") {
      setFilter({ ...filter, sort: value })
    } else {
      setFilter({ ...filter, category: filter.category, search: filter.search })
    }
    fetchMarketplace()
  }

  if (loading) {
    return (
      <div className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-zinc-600">Loading marketplace...</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Orbis Marketplace
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Browse professionally designed websites and templates for your business.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 mb-8 shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Apply filters - state is managed locally, re-fetch on mount
              // Could also trigger a refetch here
            }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {/* Category Filter */}
            <div>
              <label className="block text-zinc-700 text-sm font-medium mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value:controlled
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-zinc-700 text-sm font-medium mb-2">
                Search
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.3-4.3"></path>
                </svg>
                <input
                  type="text"
                  name="search"
                  value={filter.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 pl-10 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-zinc-700 text-sm font-medium mb-2">
                Sort by
              </label>
              <div className="relative">
                <select
                  name="sort"
                  value:controlled
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                >
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-a">Name: A to Z</option>
                  <option value="name-z">Name: Z to A</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No results message */}
        {!loading && products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No products found matching your criteria.
            </p>
            <p className="text-zinc-500 text-sm mt-2">
              Try adjusting your search or filter options.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border">
      <div className="relative h-64">
        <Image
          src={product.images?.[0]?.url || "/placeholder.svg?height=280&width=400"}
          alt={product.name}
          className="object-cover w-full h-full duration-slow group-hover:scale-105 transition-transform"
          width={400}
          height={280}
        />
        <span
          className="absolute top-3 left-3 bg-orange-600 text-xs text-white px-2 rounded"
        >
          {product.discountPrice
            ? `₹${product.price} (₹${product.discountPrice})`
            : `₹${product.price}`}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium text-zinc-900 group-hover:text-orange-600 transition-colors mb-1">
          {product.name}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2">
          {product.shortDescription || "No description available"}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-zinc-500 text-xs">
            {product.category?.name || "Uncategorized"}
          </span>
          <span className="text-orange-600 font-medium text-sm">
            {product.featured ? "Featured" : ""}
          </span>
        </div>
      </div>
    </div>
  )
}