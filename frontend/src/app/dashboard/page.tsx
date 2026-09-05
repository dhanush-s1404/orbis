"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface DashboardNavItem {
  key: string
  label: string
  href: string
  icon?: string
}

interface Project {
  id: string
  projectId: string
  name: string
  description: string | null
  status: string
  progress: number
  budget: number | null
  timeline: string | null
  assignedDeveloper: string | null
  createdAt: string
  updatedAt: string
  publishStatus: "DRAFT" | "PUBLISHED" | "PUBLISH_FAILED"
}

interface MetricCard {
  label: string
  value: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon: string
  bg?: "default" | "orange" | "green" | "purple" | "teal"
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<keyof DashboardNavItem>("overview")
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)

  const handlePublish = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to publish")
      }
      const data = await response.json()
      fetchProjects()
      return data
    } catch (err) {
      console.error("Publish error:", err)
      throw err
    }
  }

  const handleUnpublish = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/unpublish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to unpublish")
      }
      fetchProjects()
      return data
    } catch (err) {
      console.error("Unpublish error:", err)
      throw err
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please sign in to view your dashboard")
      return
    }
    fetchProjects()
  }, [isAuthenticated])

  const fetchProjects = async () => {
    if (!user?.id) return
    try {
      const response = await fetch("/api/projects", {
        cache: "no-store",
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data.projects || [])
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load projects. Please try again.")
    }
  }, [user?.id])

  const handleSignOut = () => {
    logout()
  }

  const navItems: DashboardNavItem[] = [
    { key: "overview", label: "Overview", href: "/dashboard" },
    { key: "my-websites", label: "My Websites", href: "/dashboard/websites" },
    { key: "projects", label: "Projects", href: "/dashboard/projects" },
    { key: "templates", label: "Templates", href: "/templates" },
    { key: "stores", label: "Stores", href: "/dashboard/stores" },
    { key: "products", label: "Products", href: "/dashboard/products" },
    { key: "orders", label: "Orders", href: "/dashboard/orders" },
    { key: "analytics", label: "Analytics", href: "/dashboard/analytics" },
    { key: "settings", label: "Settings", href: "/dashboard/settings" },
  ]

  const handleNavChange = (key: keyof DashboardNavItem) => {
    setActiveSection(key)
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
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Sign In
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Please sign in to access your ORBIS dashboard.
          </p>
          <button
            onClick={handleSignOut}
            className="py-3 px-6 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-500 transition-colors text-lg"
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
          <div className="flex items-center justify-center">
            <p className="text-lg text-zinc-600">Loading dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-zinc-100 dark:bg-zinc-800/30 rounded-3xl p-6 text-zinc-800">
            <p className="text-zinc-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 py-2 px-4 text-orange-600 font-medium rounded-xl hover:underline transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Metric cards data
  const metrics: MetricCard[] = [
    {
      label: "Total Websites",
      value: projects.length.toString(),
      icon: "lucide:building",
      bg: "default",
    },
    {
      label: "Published",
      value: (projects.filter((p) => p.publishStatus === "PUBLISHED")
        .length || 0).toString(),
      trend: "up",
      trendValue: "+12%",
      icon: "lucide:check-circle",
      bg: "green",
    },
    {
      label: "Products",
      value: "24",
      trend: "up",
      trendValue: "+8%",
      icon: "lucide:grid",
      bg: "purple",
    },
    {
      label: "Revenue",
      value: "$45,230",
      trend: "up",
      trendValue: "+15%",
      icon: "lucide:dollar-sign",
      bg: "teal",
    },
  ]

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header with user info and quick actions */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm-items-center gap-6">
            {/* Left: User info and welcome */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Dashboard
              </h1>
              <p className="text-zinc-500 text-sm dark:text-zinc-400">
                Welcome back, {user?.name || "Orbis user"}
              </p>
            </div>

            {/* Right: Quick actions */}
            <div className="flex sm:ml-auto gap-3">
              <Link
                href="/build"
                className="flex h-10 items-center justify-center rounded-full bg-orange-100 px-4 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors"
              >
                <span className="iconify" icon="lucide:build-square" width={18} height={18} />
                Create Website
              </Link>
              <Link
                href="/templates"
                className="flex h-10 items-center justify-center rounded-full border border-orange-400 px-4 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors"
              >
                <span className="iconify" icon="lucide:grid" width={18} height={18} />
                Templates
              </Link>
              <Link
                href="/dashboard/products"
                className="flex h-10 items-center justify-center rounded-full bg-purple-100 px-4 text-purple-600 text-sm font-medium hover:bg-purple-50 transition-colors"
              >
                <span className="iconify" icon="lucide:box" width={18} height={18} />
                Products
              </Link>
            </div>
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`rounded-2xl p-6 text-left transition-shadow hover:shadow-xl ${
                metric.bg === "default"
                  ? "bg-white dark:bg-zinc-900"
                  : metric.bg === "orange"
                  ? "bg-orange-50 dark:bg-orange-900/30"
                  : metric.bg === "green"
                  ? "bg-green-50 dark:bg-green-900/30"
                  : metric.bg === "purple"
                  ? "bg-purple-50 dark:bg-purple-900/30"
                  : metric.bg === "teal"
                  ? "bg-teal-50 dark:bg-teal-900/30"
                  : "bg-white dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center ${
                  metric.bg === "orange"
                    ? "bg-orange-100 text-orange-600"
                  : metric.bg === "green"
                    ? "bg-green-100 text-green-600"
                  : metric.bg === "purple"
                    ? "bg-purple-100 text-purple-600"
                  : metric.bg === "teal"
                    ? "bg-teal-100 text-teal-600"
                    : "bg-zinc-100 text-zinc-600"
                }">
                  <span className="iconify" icon={metric.icon as any} width={20} height={20} />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {metric.value}
                  </p>
                </div>
              </div>

              {/* Trend indicator */}
              {metric.trend && metric.trendValue && (
                <div className="mt-2 flex items-center gap-2 text-zinc-500 text-sm">
                  <span className={`iconify ${
                    metric.trend === "up"
                      ? "text-green-500"
                      : metric.trend === "down"
                        ? "text-red-500"
                        : "text-zinc-400"
                      }`}
                    icon="lucide:${
                      metric.trend === "up" ? "trending-up" : metric.trend === "down" ? "trending-down" : "minus"
                    }"
                    width={14}
                    height={14}
                  />{" "}
                  <span>{metric.trendValue}</span>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Recent Activity Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Recent Activity
            </h2>
            <Link
              href="/dashboard/activity"
              className="text-zinc-500 text-sm font-medium hover:text-zinc-700 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {[
              { user: "Sarah J.", action: "Published website", time: "2h ago", icon: "lucide:check-circle", color: "green" },
              { user: "Mike T.", action: "Created project", time: "5h ago", icon: "lucide:plus", color: "orange" },
              { user: "Agency Partner", action: "Added product", time: "1d ago", icon: "lucide:grid", color: "purple" },
              { user: "Sarah J.", action: "Published website", time: "2h ago", icon: "lucide:check-circle", color: "green" },
              { user: "Mike T.", action: "Created project", time: "5h ago", icon: "lucide:plus", color: "orange" },
            ].map((activity) => (
              <div
                key={activity.action}
                className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  activity.color === "green"
                    ? "bg-green-100 text-green-600"
                  : activity.color === "orange"
                    ? "bg-orange-100 text-orange-600"
                  : activity.color === "purple"
                    ? "bg-purple-100 text-purple-600"
                  : "bg-zinc-100 text-zinc-600"
                }">
                  <span className="iconify" icon={activity.icon as any} width={18} height={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-1">
                    {activity.user} {activity.action}
                  </p>
                  <p className="text-zinc-400 text-xs dark:text-zinc-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nav States */}
        {activeSection === "overview" && (
          <div className="ml-64 p-6 flex-1">
            <p className="text-zinc-500">
              Select a section from the sidebar to get started.
            </p>
          </div>
        )}

        {activeSection === "my-websites" && (
          <div className="ml-64 p-6 flex-1">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 dark:text-zinc-100">
              My Websites
            </h2>
            <p className="text-zinc-500">
              Website management coming soon.
            </p>
          </div>
        )}

        {activeSection === "projects" && (
          <div className="ml-64 p-6 flex-1">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 dark:text-zinc-100">
              My Projects
            </h2>
            {/* Projects section already rendered above */}
          </div>
        )}

        {activeSection === "analytics" && (
          <div className="ml-64 p-6 flex-1">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 dark:text-zinc-100">
              Analytics
            </h2>
            <p className="text-zinc-500">
              Analytics dashboard coming soon.
            </p>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="ml-64 p-6 flex-1">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 dark:text-zinc-100">
              Settings
            </h2>
            <p className="text-zinc-500">
              Account settings coming soon.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

interface ProductCardProps {
  name: string
  price: string
  description: string
  href?: string
}

function ProductCard({
  name,
  price,
  description,
  href = "/product/1",
}: ProductCardProps) {
  return (
    <div className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border">
      <div className="relative h-64">
        <Image
          src="/placeholder.svg?height=300&width=400"
          alt={name}
          className="object-cover w-full h-full duration-transform group-hover:scale-105 transition-transform"
          width={400}
          height={300}
        />
        <span
          className="absolute top-3 left-3 bg-orange-600 text-xs text-white px-2 rounded"
        >
          {price}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-base font-medium text-zinc-900 group-hover:text-orange-600 transition-colors mb-1">
          {name}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2">
          {description}
        </p>

        <div className="mt-4">
          <Link
            href={href}
            className="block w-full bg-orange-600 text-white font-medium py-2 rounded-md hover:bg-orange-500 transition-colors text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}