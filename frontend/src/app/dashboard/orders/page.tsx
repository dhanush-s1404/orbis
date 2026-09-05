"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

interface Order {
  id: string
  userId: string
  total: number
  currency: string
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED"
  orderStatus: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  paymentId: string | null
  sessionId: string | null
  createdAt: string
  updatedAt: string
  orderItems: {
    productId: string
    quantity: number
    price: number
    product: {
      name: string
      slug: string
      images: { url: string }[]
    }
  }[]
}

interface OrderFilters {
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" | null
  search: string
}

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filters, setFilters] = useState<OrderFilters>({
    status: null,
    search: "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    fetchOrders()
  }, [isAuthenticated])

  const fetchOrders = async () => {
    if (!user?.id) return
    try {
      const searchParams = new URLSearchParams()
      if (filters.status) searchParams.append("status", filters.status)
      if (filters.search) searchParams.append("search", filters.search)
      searchParams.append("page", "1")
      searchParams.append("limit", "20")

      const response = await fetch(`/api/orders?${searchParams}`, {
        cache: "no-store",
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data.orders)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load orders. Please try again.")
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
            Please sign in to view orders.
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
          <p className="text-lg text-zinc-600">Loading orders...</p>
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
              Orders
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Order management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="py-2 px-3 text-sm text-zinc-500 hover:text-zinc-600 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </header>

        {/* Filters */}
        <section className="mb-6 rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Order ID or Customer
              </label>
              <input
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder="Search orders..."
                className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              />
            </div>

            {/* Actions */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: null, search: "" })}
                className="px-3 py-1.5 text-zinc-500 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Orders List */}
        <section className="rounded-2xl bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                No orders found matching your criteria.
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                Check filters or wait for new orders.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200/50">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Order
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Customer
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Date
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Items
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Total
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Status
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                        <code className="text-zinc-500 text-sm">{order.id.slice(0, 8)}...</code>
                      </td>
                      <td className="p-4 text-zinc-600 dark:text-zinc-400">
                        {order.orderItems?.[0]?.product?.name || "Unknown customer"}
                      </td>
                      <td className="p-4 text-zinc-500 dark:text-zinc-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-zinc-500 dark:text-zinc-400 text-sm">
                        {order.orderItems?.length || 0}
                      </td>
                      <td className="p-4 text-orange-600 font-medium text-lg">
                        ₹{order.total}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                            order.orderStatus === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.orderStatus === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : order.orderStatus === "REFUNDED"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.paymentStatus === "PAID"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {order.paymentStatus === "PAID"
                          ? "Paid"
                          : order.paymentStatus === "PENDING"
                            ? "Pending"
                            : "Failed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty state */}
          {orders.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                No orders yet.
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                Start selling to receive orders.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}