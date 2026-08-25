"use client"

import { useEffect, useState, useSearchParams } from "react"
import { useRouter } from "next/navigation"
import { PublishedWebsite } from "@/components/renderer/renderer.component"

interface Props {
  params: { slug: string }
}

export default function PublishedPage({ params }: Props) {
  const [config, setConfig] = useState<{
    templateId: string
    pages: any[]
    styles: any
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const slug = params.slug

  useEffect(() => {
    // Fetch published website data from backend
    fetch(`/api/publish/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Published website not found")
        }
        return res.json()
      })
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching published website:", err)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-zinc-600">Loading published website...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Published Website Not Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            This project has not been published yet or the link is invalid.
          </p>
          <Link
            href="/dashboard/projects"
            className="mt-4 py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return <PublishedWebsite slug={slug} config={config} />
}