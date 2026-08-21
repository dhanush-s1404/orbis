import Image from "next/image"
import Link from "next/link"
use client

export default function Marketplace() {
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

const products = [
  {
    id: "1",
    name: "Business Pro",
    slug: "business-pro",
    shortDescription: "Full business website with CMS",
    price: "₹14,999",
    demoUrl: "/demo",
    category: "Business",
  },
  {
    id: "2",
    name: "Portfolio Studio",
    slug: "portfolio-studio",
    shortDescription: "Professional portfolio website",
    price: "₹8,999",
    demoUrl: "/demo",
    category: "Portfolio",
  },
  {
    id: "3",
    name: "E-commerce Store",
    slug: "e-commerce-store",
    shortDescription: "Complete online store with payments",
    price: "₹19,999",
    demoUrl: "/demo",
    category: "E-commerce",
  },
  {
    id: "4",
    name: "Restaurant",
    slug: "restaurant",
    shortDescription: "Restaurant website with menu",
    price: "₹6,999",
    demoUrl: "/demo",
    category: "Restaurant",
  },
  {
    id: "5",
    name: "SaaS Platform",
    slug: "saas-platform",
    shortDescription: "SaaS website with subscription features",
    price: "₹24,999",
    demoUrl: "/demo",
    category: "SaaS",
  },
  {
    id: "6",
    name: "Landing Page Pro",
    slug: "landing-page-pro",
    shortDescription: "High-converting landing page",
    price: "₹4,999",
    demoUrl: "/demo",
    category: "Landing Page",
  },
]

interface ProductCardProps {
  product: typeof products[0]
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border" onClick={() => window.location.href = `/product/${product.slug}`}>
      <div className="relative h-64">
        <Image
          src="/placeholder.svg?height=400&width=560"
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