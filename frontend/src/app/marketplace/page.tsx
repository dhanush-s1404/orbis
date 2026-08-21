"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Marketplace() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products")
      
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data.products)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-zinc-600">Loading websites...</p>
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
    <div className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Marketplace</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Browse and purchase ready-made websites</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: any
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border" onClick={() => window.location.href = `/product/${product.slug}`}>
      <div className="relative h-64">
        <Image
          src={product.images?.[0]?.url || "/placeholder.svg?height=400&width=560"}
          alt={product.name}
          className="object-cover w-full h-full duration-slow group-hover:scale-105 transition-transform"
        />
        <span className="absolute top-3 left-3 bg-zinc-900 text-xs text-white px-2 rounded"
              style={{ zIndex: 10 }}>${product.price}</span>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors mb-2">{product.name}</h3>
        <p className="text-zinc-500 text-sm line-clamp-2">{product.shortDescription}</p>
      </div>
    </div>
  )
}