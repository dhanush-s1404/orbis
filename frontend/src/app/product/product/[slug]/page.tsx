"use client"

import Image from "next/image"
import { useParams, Suspense } from "next/navigation"
import { useRouter } from "next/navigation"
import { prisma } from "@/lib/prisma"

interface ProductDetailsProps {
  params: { slug: string }
}

export default function ProductPage({ params }: ProductDetailsProps) {
  const router = useRouter()
  const { slug } = params

  // Fetch product from database
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      features: true,
      technologies: true,
      images: true,
    },
  })

  if (!product) {
    return <div className="p-8">Product not found</div>
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image.url}
                  alt={product.name}
                  className="object-cover rounded-b-lg"
                  width={560}
                  height={400}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 mb-4">
              {product.features.map((feature) => (
                <span
                  key={feature.name}
                  className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium px-2.5 py-0.5"
                  style={{ zIndex: 10 }}
                >
                  {feature.name}
                </span>
              ))}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-zinc-900 mb-2">{product.name}</h1>
              <p className="text-zinc-500 mb-4">{product.shortDescription}</p>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-zinc-900">{product.price}</span>
              {product.discountPrice && (
                <s className="line-through text-zinc-400 text-sm">₹{product.discountPrice}</s>
              )}
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-zinc-500 text-sm">Category:</span>
              <span className="text-zinc-700 font-medium">{product.category?.name}</span>
            </div>

            <div>
              <h2 className="text-xl font-medium text-zinc-700 mb-4">What's Included</h2>
              <ul className="list-disc pl-5 text-zinc-700 space-y-1">
                <li>Modern, responsive design</li>
                <li>SEO optimized</li>
                <li>Mobile-friendly</li>
                <li>Free lifetime updates</li>
                <li>Source code included</li>
                <li>Documentation included</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-medium text-zinc-700 mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {product.technologies.map((tech) => (
                  <span
                    key={tech.name}
                    className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium px-3 py-1"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <a
                href="/marketplace"
                className="w-full bg-zinc-900 text-white font-medium py-3 rounded-md hover:bg-zinc-800 transition-colors text-center"
              >
                ← Back to Marketplace
              </a>
              <a
                href="/build"
                className="w-full mt-4 bg-zinc-800 text-white font-medium py-3 rounded-md hover:bg-zinc-700 transition-colors text-center"
              >
                Build a Similar Website
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-zinc-700 mb-4">Live Demo</h2>
              <p className="text-zinc-500">{product.demoUrl ? 'View Live Demo' : 'No live demo available'}</p>
            </div>

            <div>
              <h2 className="text-xl font-medium text-zinc-700 mb-4">Product Screenshots</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image.url}
                    alt={`${product.name} screenshot ${index + 1}`}
                    width={400}
                    height={300}
                    className="object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium text-zinc-700 mb-4">Product Information</h2>
              <dl className="grid grid-cols-2 gap-4 text-zinc-600">
                <dt className="font-medium">Version</dt>
                <dd>{product.features.includes("Latest Version") ? "Latest" : "N/A"}</dd>
                
                <dt className="font-medium">Responsive Support</dt>
                <dd>{product.features.includes("Responsive") ? "Yes" : "No"}</dd>
                
                <dt className="font-medium">SEO Support</dt>
                <dd>{product.features.includes("SEO") ? "Yes" : "No"}</dd>
                
                <dt className="font-medium">Backend Included</dt>
                <dd>{product.features.includes("Backend") ? "Yes" : "No"}</dd>
                
                <dt className="font-medium">Database Included</dt>
                <dd>{product.features.includes("Database") ? "Yes" : "No"}</dd>
                
                <dt className="font-medium">Authentication Included</dt>
                <dd>{product.features.includes("Authentication") ? "Yes" : "No"}</dd>
                
                <dt className="font-medium">Admin Panel Included</dt>
                <dd>{product.features.includes("Admin Panel") ? "Yes" : "No"}</dd>
                
                <dt className="font-medium">Deployment Support</dt>
                <dd>{product.features.includes("Deployment") ? "Yes" : "No"}</dd>
                
                <dt className="font-medium">Customization</dt>
                <dd>{product.features.includes("Customization") ? "Yes" : "Limited"}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}