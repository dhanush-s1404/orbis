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
      // Refresh projects
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
      const data = await response.json()
      // Refresh projects
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
      setProjects(data.projects)
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
    { key: "domains", label: "Domains", href: "/dashboard/domains" },
    { key: "analytics", label: "Analytics", href: "/dashboard/analytics" },
    { key: "messages", label: "Messages", href: "/dashboard/messages" },
    { key: "billing", label: "Billing", href: "/dashboard/billing" },
    { key: "settings", label: "Settings", href: "/dashboard/settings" },
  ]

  const handleNavChange = (key: keyof DashboardNavItem) => {
    setActiveSection(key)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
              Sign In
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Please sign in to access your ORBIS dashboard.
            </p>
            <button
              onClick={handleSignOut}
              className="mt-4 py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
            >
              Continue Without Signing In
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-lg text-zinc-600">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6 text-zinc-800">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-3 py-2 px-4 text-orange-600 font-medium hover:underline"
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
                Welcome back, {user?.name || "Orbis user"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 text-sm">
                {new Date().toLocaleDateString()}
              </span>
              <button
                onClick={handleSignOut}
                className="py-2 px-4 text-sm text-zinc-500 hover:text-zinc-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </header>

          {/* Projects Section */}
          {activeSection === "projects" && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
                My Projects
              </h2>

              {/* Loading state */}
              {isLoading && (
                <div className="py-8 text-center">
                  <p className="text-zinc-500">Loading projects...</p>
                </div>
              )}

              {/* Empty state */}
              {projects.length === 0 && !isLoading && (
                <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/30 rounded-lg">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-zinc-400 dark:text-zinc-500"
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
                  <h3 className="text-zinc-500 mb-2">No projects yet</h3>
                  <p className="text-zinc-400 text-sm">
                    Create your first project to get started with ORBIS.
                  </p>
                  <Link
                    href "/build"
                    className="mt-3 py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors text-sm"
                  >
                    Create Project
                  </Link>
                </div>
              )}

              {/* Projects List */}
              {projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border"
                    >
                      <div className="h-48 bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center">
                        <span className="text-zinc-400 text-sm">
                          {project.status || "Submitted"}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                          {project.name}
                        </h3>
                        <p className="text-zinc-500 text-sm line-clamp-2">
                          {project.description || "No description"}
                        </p>
                        <div className="mt-3 flex flex-col sm:flex-row gap-2 text-zinc-500 text-xs">
                          <span>#{project.progress || 0}%</span>
                          <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "—"}</span>
                          {project.assignedDeveloper && (
                            <span>Dev: {project.assignedDeveloper}</span>
                          )}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Link
                            href `/project/${project.id}`
                            className="flex-1 py-2 px-2 text-orange-600 text-sm font-medium rounded border border-orange-600 hover:bg-orange-100 transition-colors"
                          >
                            View
                          </Link>
                          
                          {/* Publish status badge */}
                          {project.publishStatus && (
                            <span className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                              project.publishStatus === "PUBLISHED" 
                                ? "bg-green-100 text-green-800" 
                                : project.publishStatus === "UNPUBLISHED"
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : "bg-gray-100 text-gray-800"
                            } mb-2`}>
                              {project.publishStatus === "PUBLISHED" 
                                ? "Published" 
                                : project.publishStatus === "UNPUBLISHED"
                                  ? "Unpublished" 
                                  : "Draft"
                              }
                            </span>
                          )}
                          
                          {project.publishStatus !== "PUBLISHED" && (
                            <div className="mt-2">
                              <button
                                onClick={() => handlePublish(project.id)}
                                className="py-1 px-2 text-xs text-orange-600 font-medium rounded border border-orange-600 hover:bg-orange-100 transition-colors"
                                disabled={project.builderState ? false : true}
                              >
                                Publish
                              </button>
                            </div>
                          )}
                          {project.publishStatus === "PUBLISHED" && (
                            <div className="mt-2">
                              <button
                                onClick={() => handleUnpublish(project.id)}
 className="py-1 px-2 text-xs text-yellow-600 font-medium rounded border border-yellow-600 hover:bg-yellow-100 transition-colors"
                              >
                                Unpublish
                              </button>
                            </div>
                          )}
                          <Link
                            href `/project/${project.id}`
                            className="flex-1 py-2 px-2 text-zinc-600 text-sm rounded bg-zinc-100 dark:bg-zinc-800/30 hover:bg-zinc-200 transition-colors"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Default: show overview when no specific section is active */}
          {activeSection !== "projects" && activeSection !== "my-websites" && (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
                Dashboard
              </h2>
              <p className="text-zinc-500">
                Select a section from the sidebar to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}