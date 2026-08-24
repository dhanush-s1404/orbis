"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface DashboardNavItem {
  key: string
  label: string
  href: string
  icon?: string
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<keyof DashboardNavItem>("overview")

  const navItems: DashboardNavItem[] = [
    { key: "overview", label: "Overview", href: "/dashboard" },
    { key: "my-websites", label: "My Websites", href: "/dashboard/websites" },
    { key: "build", label: "Build Website", href: "/build" },
    { key: "improve", label: "Improve Website", href: "/improve" },
    { key: "projects", label: "Projects", href: "/dashboard/projects" },
    { key: "templates", label: "Templates", href: "/templates" },
    { key: "stores", label: "Stores", href: "/dashboard/stores" },
    { key: "products", label: "Products", href: "/dashboard/products" },
    { key: "orders", label: "Orders", href: "/dashboard/orders" },
    { key: "domains", label: "Domains", href: "/dashboard/domains" },
    { key: "analytics", label: "Analytics", href: "/dashboard/analytics" },
    { key: "messages", label: "Messages", href: "/dashboard/messages" },
    { key: "billing", label: "Billing", href: "/dashboard/billing" },
    { key: "settings", label: "Settings", href: "/dashboard/settings" },
  ]

  const handleNavChange = (key: keyof DashboardNavItem) => {
    setActiveSection(key)
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-zinc-900 fixed left-0 top-0 bottom-0 shadow-2xl border-r border-zinc-200/50 flex flex-col">
          <div className="p-6 border-b border-zinc-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2=9 y2="1"></line>
                </svg>
              </div>
              <span className="font-semibold text-orange-600 text-lg">Orbis</span>
            </div>
          </div>

          <nav className="flex-1 pt-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavChange(item.key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-left text-zinc-600 hover:text-zinc-900 transition-colors ${activeSection === item.key ? "bg-orange-100 text-orange-600 font-medium" : ""}`}
                  aria-current={activeSection === item.key ? "page" : "false"}
                >
                  {item.icon && (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="p-6 border-t border-zinc-200/50">
            <button
              onClick={() => setActiveSection("overview")}
              className="w-full py-3 px-4 text-sm text-zinc-500 hover:text-zinc-600 transition-colors"
            >
              Orbis
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64 p-6 flex-1">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Dashboard
              </h1>
              <p className="text-zinc-500 text-sm">
                Welcome back, Orbis user
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 text-sm">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </header>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
                Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/30">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-zinc-500 text-xs mt-1">Active Projects</div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/30">
                  <div className="text-2xl font-bold text-orange-600">$45,230</div>
                  <div className="text-zinc-500 text-xs mt-1">Monthly Revenue</div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/30">
                  <div className="text-2xl font-bold text-orange-600">98%</div>
                  <div className="text-zinc-500 text-xs mt-1">Uptime</div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/30">
                  <div className="text-2xl font-bold text-orange-600">1,247</div>
                  <div className="text-zinc-500 text-xs mt-1">Messages</div>
                </div>
              </div>
            </div>
          )}

          {/* My Websites Section */}
          {activeSection === "my-websites" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border"
                >
                  <div className="h-48 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
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
                  <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                    Website Project {i + 1}
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    In progress
                  </p>
                  <div className="mt-3">
                    <span className="text-zinc-400 text-xs mr-2">Active</span>
                    <span className="text-zinc-400 text-xs">Oct 2024</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Default message when no section specific content */}
          {activeSection !== "overview" && activeSection !== "my-websites" && (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
                Section Coming Soon
              </h2>
              <p className="text-zinc-500">
                The {activeSection} section is under development. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}