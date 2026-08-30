"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

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
  features: string[]
  tags: string[]
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  featured: boolean
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  total: number
  itemCount: number
}

const CartContext = React.createContext<CartContextValue | undefined>(undefined)

function useCart(): CartContextValue {
  const [items, setItems] = React.useState<CartItem[]>([])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [{ ...product, quantity }, ...prev.filter((item) => item.product.id !== product.id)]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, total, itemCount }
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()
  const cart = useCart()

  useEffect(() => {
    // Fetch product by slug
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product")
        return res.json()
      })
      .then((data) => {
        setProduct(data.product)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load product")
        setLoading(false)
      })
  }, [slug])

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
            Sign In
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Please sign in to view product details.
          </p>
          <button className="py-3 px-6 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors">
            Continue Without Signing In
          </button>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-zinc-600">Loading product...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-zinc-100 dark:bg-zinc-800/30 rounded-3xl p-6 text-zinc-800">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-4 py-2 px-4 text-orange-600 font-medium rounded-md hover:underline transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
              Product not found
            </h1>
            <p className="text-zinc-500">
              The product you are looking for does not exist.
            </p>
            <Link to="/marketplace" className="mt-4 py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors">
              ← Back to Marketplace
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Product Images Carousel */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Image */}
            <div>
              <Image
                src={product?.images?.[0]?.url || "/placeholder.svg?height=600&width=800"}
                alt={product?.name}
                className="rounded-2xl overflow-hidden h-[600] w-full"
                width={800}
                height={600}
              />
            </div>
            {/* Thumbnails */}
            <div className="space-y-2">
              {product?.images.map((image, index) => (
                <Image
                  key={index}
                  src={image.url}
                  alt={`${product?.name} thumbnail ${index + 1}`}
                  width={400}
                  height={300}
                  className="rounded-lg cursor-pointer opacity-60 transition-opacity group-hover:opacity-100"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Product Info */}
        <section className="mb-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              {/* Price */}
              <div className="mb-4">
                {product?.discountPrice ? (
                  <p className="text-orange-600 text-3xl font-bold">
                    ₹{product?.price} (₹{product?.discountPrice})
                  </p>
                ) : (
                  <p className="text-zinc-900 text-3xl font-bold">
                    ₹{product?.price}
                  </p>
                )}
                {product?.compareAtPrice && (
                  <p className="text-zinc-500 text-sm line-through mt-1">
                    ₹{product?.compareAtPrice}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div>
                {isAuthenticated ? (
                  <div className="mt-4">
                    <button
                      onClick={() => cart.addItem(product, 1)}
                      className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors text-center"
                    >
                      {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </button>
                ) : (
                  <button
                    className="w-full py-3 px-4 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 transition-colors text-center"
                    disabled>
                      Sign in to add to cart
                  </button>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Product Details
              </h2>
              
              {product?.features && product?.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-zinc-600 text-sm mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature) => (
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

              {product?.tags && product?.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-zinc-600 text-sm mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium px-2.5 py-0.5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-zinc-600 mb-4">
                SKU: {product?.sku || "Not available"}
              </p>
              <p className="text-zinc-600 mb-4">
                Stock: {product?.inventory > 0 ? `${product.inventory} available` : "Out of stock"}
              </p>
              <p className="text-zinc-600 mb-4">
                Status: {product?.status === "ACTIVE" ? "Active" : product?.status === "DRAFT" ? "Draft" : "Archived"}
              </p>
            </div>
          </div>
        </section>

        {/* Description */}
        {product?.fullDescription && (
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Description
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 line-clamp-4">
              {product.fullDescription}
            </p>
          </section>
        )}

        {/* Related Products */}
        {/* Would fetch related products by category or featured */}
        {/* <RelatedProducts section /> */}

        {/* Cart Sidebar */}
        {isAuthenticated && (
          <section className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm fixed bottom-0 left-0 right-0">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
                Cart
              </h3>
              {cart.items.length === 0 ? (
                <p className="text-zinc-500">Your cart is empty</p>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/30"
                    >
                      <Image
                        src={item.product.images?.[0]?.url || "/placeholder.svg?height=80&width=80"}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {item.product.name}
                        </h4>
                        <p className="text-zinc-500 text-sm">
                          ₹{item.product.price}
                        </p>
                      </div>
                      <div className="w-16">
                        <button
                          onClick={() => cart.updateQuantity(item.product.id, 1)}
                          className="py-1 px-1 rounded bg-orange-100 text-orange-600 text-xs hover:bg-orange-200 transition-colors"
                        >
                          +
                        </button>
                        <span className="ml-2 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => cart.updateQuantity(item.product.id, -1)}
                          className="py-1 px-1 rounded bg-orange-100 text-orange-600 text-xs hover:bg-orange-200 transition-colors"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-zinc-200/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-600 text-sm">Items: {cart.itemCount}</span>
                  <span className="text-orange-600 font-medium text-lg">
                    ₹{cart.total}
                  </span>
                </div>
                <button
                  onClick={() => window.location.href="/cart"}
                  className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors text-center"
                >
                  Checkout (₹{cart.total})
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </main>
  )
}

interface ProductCardProps {
  product: Product
  showActions?: boolean
}

function ProductCard({ product, showActions = true }: ProductCardProps) {
  return (
    <div className="group bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow border">
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

        {showActions && (
          <div className="mt-3 pt-3 border-t border-zinc-200/50">
            <Link
              href `/product/${product.slug}`
              className="block w-full bg-orange-600 text-white font-medium py-2 rounded-md hover:bg-orange-500 transition-colors text-center text-sm"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}