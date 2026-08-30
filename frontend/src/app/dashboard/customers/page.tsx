"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface Customer {
  id: string
  name: string
  email: string
  totalOrders: number
  totalSpending: number
  lastOrder: {
    id: string
    date: string
    total: number
    status: string
  } | null
  credits: number
}

interface CustomerFilters {
  search: string
}

export default function CustomersPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filters, setFilters] = useState<CustomerFilters>({
    search: "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    fetchCustomers()
  }, [isAuthenticated])

  const fetchCustomers = async () => {
    if (!user?.id) return
    try {
      const searchParams = new URLSearchParams()
      if (filters.search) searchParams.append("search", filters.search)
      searchParams.append("page", "1")
      searchParams.append("limit", "20")

      const response = await fetch(`/api/customers?${searchParams}`, {
        cache: "no-store",
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to fetch customers")
      }
      const data = await response.json()
      setCustomers(data.customers)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load customers. Please try again.")
    }
  }

  const handleSignOut = () => {
    // logout()
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
            Please sign in to view customers.
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
          <p className="text-lg text-zinc-600">Loading customers...</p>
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

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row items-start gap-6 border-b border-zinc-200/50 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Customers
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customer management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href "/dashboard"
              className="py-2 px-3 text-sm text-zinc-500 hover:text-zinc-600 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </header>

        {/* Filters */}
        <section className="mb-6 rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Search by name or email
              </label>
              <input
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder="Search customers..."
                className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              />
            </div>

            {/* Actions */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: "" })}
                className="px-3 py-1.5 text-zinc-500 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Customers List */}
        <section className="rounded-2xl bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          {customers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                No customers found.
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                Start receiving orders to build your customer base.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200/50">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Customer
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Email
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Orders
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Total Spent
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Last Order
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {customer.name}
                      </td>
                      <td className="p-4 text-zinc-500 dark:text-zinc-400">
                        {customer.email}
                      </td>
                      <td className="p-4 text-zinc-500 dark:text-zinc-400 text-sm">
                        {customer.totalOrders}
                      </td>
                      <td className="p-4 text-orange-600 font-medium text-lg">
                        ₹{customer.totalSpending}
                      </td>
                      <td className="p-4">
                        {customer.lastOrder?.date
                          ? new Date(customer.lastOrder.date).toLocaleDateString()
                          : "No orders"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty state */}
          {customers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                No customers yet.
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                Start selling to build your customer base.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}