"use client"

import Image from "next/image"
import { useParams, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Product {
  id: string
  projectId: string
  name: string
  slug: string
  shortDescription: string | null
  fullDescription: string | null
  price: number
  discountPrice: number | null
  category: any
  demoUrl: string | null
  status: string
  featured: boolean
  license: string
  createdAt: string
  updatedAt: string
  technologies: any[]
  features: any[]
  images: any[]
}

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number | null
  discountPrice: number | null
  image: string | null
}

export default function ProductPage() {
  const router = useRouter()
  const { slug } = router.params

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
  }, [slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products?category=${slug}`, {
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error("Failed to fetch product")
      }
      const data = await response.json()
      if (data.products.length > 0) {
        setProduct(data.products[0])
      }
      setLoading(false)
    } catch (err) {
      console.error("Error fetching product:", err)
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch("/api/products/featured", {
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error("Failed to fetch related products")
      }
      const data = await response.json()
      setRelatedProducts(data.slice(0, 3))
    } catch (err) {
      console.error("Error fetching related products:", err)
    }
  }

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">Product not found</h1>
            <p className="text-zinc-500">The product you are looking for does not exist.</p>
            <a href="/marketplace" className="mt-4 bg-orange-600 text-white font-medium py-2 rounded-md hover:bg-orange-500 transition-colors text-center">
              ← Back to Marketplace
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-zinc-500 text-sm">
          <a href="/marketplace" className="hover:text-orange-600 transition-colors">
            ← Marketplace
          </a>
          <span>→</span>
          <span>{product?.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Image Gallery */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2 mb-6">
              {product.images.map((image: any, index: number) => (
                <Image
                  key={index}
                  src={image.url}
                  alt={`${product.name} image ${index + 1}`}
                  width={560}
                  height={400}
                  className="object-cover rounded-b-lg cursor-pointer hover:opacity-90 transition-opacity"
                />
              ))}
            </div>

            {/* Main Product Image */}
            <div className="relative">
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg?height=600&width=800"}
                alt={product.name}
                className="rounded-2xl overflow-hidden h-[600] object-cover"
                width={800}
                height={600}
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
            </div>

            {/* Features Chips */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {product.features?.map((feature: any) => (
                <span
                  key={feature}
                  className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium px-2.5 py-0.5"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {product.name}
              </h1>
              {product.discountPrice && (
                <p className="text-orange-600 text-2xl font-bold">
                  ₹{product.price} (₹{product.discountPrice})
                </p>
              )}
              {!product.discountPrice && (
                <p className="text-zinc-500 text-2xl font-bold">
                  ₹{product.price}
                </p>
              )}
            </div>

            <p className="text-zinc-500 mb-6 line-clamp-3">{product.shortDescription || "No description available"}</p>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-zinc-600 text-sm">
              <div>
                <span className="font-medium">Category:</span>
                <span>{product.category?.name || "Uncategorized"}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${product.status === "ACTIVE" ? "bg-zinc-100 text-zinc-800" : "bg-orange-100 text-orange-800"}`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            {/* Technologies */}
            {product.technologies && product.technologies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-medium text-zinc-700 mb-3">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {product.technologies.map((tech: any) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium px-3 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-medium text-zinc-700 mb-3">Features</h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feature: any) => (
                    <span
                      key={feature}
                      className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium px-2.5 py-0.5"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-zinc-200/50">
              <div className="flex gap-3">
                <a
                  href "/build"
                  className="flex-1 py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors text-center"
                >
                  Build a Similar Website
                </a>
                <a
                  href "/marketplace"
                  className="flex-1 py-3 px-4 text-orange-600 font-medium rounded-md border border-orange-600 hover:bg-orange-100 transition-colors text-center"
                >
                  ← Back to Marketplace
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}