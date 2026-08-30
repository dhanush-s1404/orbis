"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  fullDescription: string | null
  price: number
  discountPrice: number | null
  compareAtPrice: number | null
  sku: string | null
  inventory: number
  category: any
  images: { url: string }[]
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  featured: boolean
  tags: string[]
}

interface ProductFilters {
  search: string
  category: string | null
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | null
  sort: "latest" | "price-low" | "price-high" | "name-a" | "name-z" | "featured"
}

interface ProductFormValues {
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  price: number
  discountPrice: number | null
  categoryId: string | null
  compareAtPrice: number | null
  sku: string | null
  inventory: number
  tags: string[]
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  featured: boolean
}

export default function StoreDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: null,
    status: null,
    sort: "latest",
  })
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect or show sign in
      return
    }
    fetchProducts()
  }, [isAuthenticated])

  const fetchProducts = async () => {
    if (!user?.id) return
    try {
      const searchParams = new URLSearchParams()
      if (filters.search) searchParams.append("search", filters.search)
      if (filters.category) searchParams.append("category", filters.category)
      if (filters.status) searchParams.append("status", filters.status)
      searchParams.append("sort", filters.sort)
      searchParams.append("page", "1")
      searchParams.append("limit", "12")

      const response = await fetch(`/api/products?${searchParams}`, {
        cache: "no-store",
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data.products)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load products. Please try again.")
    }
  }

  const handleSignOut = () => {
    // logout()
  }

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (product: ProductFormValues) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
      if (!response.ok) {
        throw new Error("Failed to create product")
      }
      const data = await response.json()
      setProducts((prev) => [...prev, data])
      setIsModalOpen(false)
      setEditingProduct(null)
    } catch (err) {
      console.error(err)
      alert("Failed to create product. Please try again.")
    }
  }

  const handleEditProduct = async (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error("Failed to delete product")
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      alert("Product deleted successfully")
    } catch (err) {
      console.error(err)
      alert("Failed to delete product. Please try again.")
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-600"
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
          <h1 className="text-3xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
            Sign In
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Please sign in to access the store dashboard.
          </p>
          <button
            className="py-3 px-6 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
          >
            Continue Without Signing In
          </button>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-lg text-zinc-600">Loading store dashboard...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-zinc-100 dark:bg-zinc-800/30 rounded-3xl p-6 text-zinc-800">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 py-2 px-4 text-orange-600 font-medium rounded-md hover:underline transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Product status filter options
  const statusFilterOptions = [
    { value: null, label: "All Statuses", bg: "gray" },
    { value: "ACTIVE", label: "Active", bg: "green" },
    { value: "DRAFT", label: "Draft", bg: "yellow" },
    { value: "ARCHIVED", label: "Archived", bg: "gray" },
  ]

  // Sort options
  const sortOptions = [
    { value: "latest", label: "Latest", icon: "lucide:clock" },
    { value: "price-low", label: "Price: Low to High", icon: "lucide:arrow-down-a-z" },
    { value: "price-high", label: "Price: High to Low", icon: "lucide:arrow-up-a-z" },
    { value: "name-a", label: "Name: A to Z", icon: "lucide:letter-a" },
    { value: "name-z", label: "Name: Z to A", icon: "lucide:letter-z" },
    { value: "featured", label: "Featured", icon: "lucide:star" },
  ]

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row items-start gap-6 border-b border-zinc-200/50 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Store Dashboard
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Manage your products and orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/products/create"
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-50 transition-colors text-sm font-medium"
            >
              <span className="iconify" icon="lucide:plus" width={18} height={18} />
              Add Product
            </Link>
            <button
              onClick={handleSignOut}
              className="py-2 px-3 text-sm text-zinc-500 hover:text-zinc-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Filters and Actions */}
        <section className="mb-6 rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">
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
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Search products..."
                  className="w-full px-10 py-2.5 pl-3 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Status
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value as any }))
                }
                className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              >
                <option value="">All Statuses</option>
                {statusFilterOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="text-zinc-600 dark:text-zinc-400"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Sort by
              </label>
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sort: e.target.value }))
                }
                className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-end">
              <button
                onClick={handleCreateProduct}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition-colors text-sm font-medium"
              >
                <span className="iconify" icon="lucide:plus" width={18} height={18} />
                Add Product
              </button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="rounded-2xl bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 products-grid">
              {products.length === 0 ? (
                <div className="col-span-1 py-12 text-center">
                  <p className="text-zinc-500 dark:text-zinc-400">
                    No products found matching your criteria.
                  </p>
                  <p className="text-zinc-400 text-sm mt-2">
                    Try adjusting your search or filter options.
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow border"
                  >
                    <div className="relative h-48">
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.svg?height=280&width=400"}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        width={400}
                        height={280}
                      />
                      {product.discountPrice && (
                        <span
                          className="absolute top-3 left-3 bg-orange-600 text-xs font-bold px-2 rounded"
                        >
                          ₹{product.price} (₹{product.discountPrice})
                        </span>
                      )}
                      {!product.discountPrice && (
                        <span
                          className="absolute top-3 left-3 bg-zinc-900 text-xs font-bold px-2 rounded"
                        >
                          ₹{product.price}
                        </span>
                      )}
                      {product.featured && (
                        <span
                          className="absolute top-3 right-3 bg-orange-100 text-orange-800 text-xs font-medium px-2 rounded"
                        >
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 transition-colors mb-1">
                        {product.name}
                      </h3>
                      <p className="text-zinc-500 text-sm line-clamp-2">
                        {product.shortDescription || "No description available"}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {product.discountPrice ? (
                            <p className="text-orange-600 font-medium text-lg">
                              ₹{product.price}
                            </p>
                          ) : (
                            <p className="text-zinc-500 text-lg font-medium">
                              ₹{product.price}
                            </p>
                          )}
                          {product.compareAtPrice && (
                            <p className="text-zinc-400 text-sm line-through">
                              ₹{product.compareAtPrice}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className="text-orange-500 font-medium text-sm">
                            {product.rating ? `${product.rating}★` : "No reviews"}
                          </span>
                        </div>
                      </div>
                      <Link
                        href `/product/${product.slug}`
                        className="mt-3 pt-3 border-t border-zinc-200/50 text-orange-600 font-medium text-sm hover:underline transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="p-4 border-t border-zinc-200/50">
              <nav className="flex justify-between items-center">
                <p className="text-zinc-500 text-sm">
                  Showing {((1 - 1) * 12) + 1}-{Math.min(12, products.length)} of {products.length} products
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 text-zinc-500 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    disabled={1 >= 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1.5 text-zinc-500 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </nav>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}