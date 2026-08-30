"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

interface RevenueMetrics {
  totalRevenue: number
  monthlyRevenue: number[]
  averageOrderValue: number
  conversionRate: number
  totalOrders: number
  totalCustomers: number
  productsSold: number
}

interface TimeFilter {
  value: "7D" | "30D" | "90D" | "1Y"
  label: string
}

export default function AnalyticsDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({ value: "30D", label: "30D" })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    fetchMetrics()
  }, [isAuthenticated])

  const fetchMetrics = async () => {
    if (!user?.id) return
    try {
      // Fetch orders for the selected time period
      const searchParams = new URLSearchParams()
      searchParams.append("period", timeFilter.value)
      searchParams.append("page", "1")
      searchParams.append("limit", "12")

      const response = await fetch(`/api/analytics?${searchParams}`, {
        cache: "no-store",
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to fetch analytics")
      }
      const data = await response.json()
      setMetrics(data.metrics)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load analytics. Please try again.")
    }
  }

  const handleSignOut = () => {
    // logout()
  }

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter)
    fetchMetrics()
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
          <p className="text-zinc-500 dark:text-zinc-400">
            Please sign in to view analytics.
          </p>
          <button className="py-3 px-6 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors">
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
          <p className="text-lg text-zinc-600">Loading analytics...</p>
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

  if (!metrics) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/30 mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-zinc-400 dark:text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
              Analytics
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Connect to view your analytics data.
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Time filter buttons
  const timeFilters: TimeFilter[] = [
    { value: "7D", label: "7D" },
    { value: "30D", label: "30D" },
    { value: "90D", label: "90D" },
    { value: "1Y", label: "1Y" },
  ]

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Analytics
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Business performance metrics
              </p>
            </div>
            <div className="self-center sm:self-auto">
              {/* Time filter */}
              <div className="flex gap-2">
                {timeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleTimeFilterChange(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      timeFilter.value === filter.value
                        ? "bg-orange-100 text-orange-600"
                        : "text-zinc-500 hover:text-zinc-600 transition-colors"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Key Metrics Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {metrics && (
            <div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  ₹{metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                  Avg Order Value
                </p>
                <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-100">
                  ₹{metrics.averageOrderValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                  Conversion Rate
                </p>
                <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-100">
                  {metrics.conversionRate}%
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                  Total Orders
                </p>
                <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                  {metrics.totalOrders.toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                  Total Customers
                </p>
                <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-100">
                  {metrics.totalCustomers.toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                  Products Sold
                </p>
                <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-100">
                  {metrics.productsSold.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Over Time */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm h-full">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Revenue Over Time
            </h2>
            <div className="h-64 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800/30">
              {/* Revenue chart would go here */}
              <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                Revenue chart
              </div>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm h-full">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Order Status Distribution
            </h2>
            <div className="h-64 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800/30">
              {/* Order status chart would go here */}
              <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                Order status chart
              </div>
            </div>
          </div>
        </section>

        {/* Product Performance */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Top Products
          </h2>
          <div className="h-96 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800/30">
            {/* Top products chart would go here */}
            <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              Top products chart
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}