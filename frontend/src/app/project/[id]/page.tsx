"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

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

interface FormErrors {
  name?: string
  description?: string
}

export default function ProjectDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    description: string
  }>({ name: "", description: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch project from backend - we'll use a placeholder ID for now
    // In a real app, this would come from routing
    const storedProject = localStorage.getItem("orbis-current-project")
    if (storedProject) {
      setProject(JSON.parse(storedProject))
    }
  }, [])

  const handleSetProject = (p: Project) => {
    setProject(p)
    localStorage.setItem("orbis-current-project", JSON.stringify(p))
  }

  const loadProject = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        cache: "no-store",
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to fetch project")
      }
      const data = await response.json()
      setProject(data.project)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (formData.name.trim().length === 0) {
      newErrors.name = "Project name is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${project?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
        }),
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to update project")
      }
      const data = await response.json()
      setProject(data.project)
      setSuccess("Project updated successfully")
      setLoading(false)
      setEditing(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!project?.id) return
    if (!confirm("Are you sure you want to archive this project?")) return
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to archive project")
      }
      const data = await response.json()
      setSuccess(data.message || "Project archived successfully")
      setProject(null)
      localStorage.removeItem("orbis-current-project")
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <p className="text-center py-12">Please sign in to view project details</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <p className="text-center py-12">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <p className="text-center py-12">
          Project not found. <Link href="/dashboard/projects" className="text-orange-600 font-medium">Go to projects</Link>
        </p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav className="mb-6">
          <Link
            href="/dashboard/projects"
            className="btn-back text-orange-600 font-medium hover:underline"
          >
            ← Back to Projects
          </Link>
        </nav>

        {success && (
          <div className="mb-4 p-3 bg-zinc-100 dark:bg-zinc-800/30 rounded-lg text-zinc-800">
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start gap-4">
            {/* Project Status Badge */}
            <div className="flex-shrink-0">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${project.status === "COMPLETED" ? "bg-green-100 text-green-800" : project.status === "ARCHIVED" ? "bg-zinc-200 text-zinc-800" : "bg-orange-100 text-orange-800"}`}
              >
                {project.status}
              </span>
            </div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {project.name}
              </h1>
              <p className="text-zinc-500 mb-4 line-clamp-3">
                {project.description || "No description"}
              </p>

              {/* Project Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Progress</p>
                  <p className="text-2xl font-bold text-orange-600">{project.progress}%</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Budget</p>
                  {project.budget !== null && project.budget > 0 ? (
                    <p className="text-2xl font-bold">₹{project.budget}</p>
                  ) : (
                    <p className="text-zinc-500">Not set</p>
                  )}
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Timeline</p>
                  {project.timeline ? (
                    <p>{project.timeline}</p>
                  ) : (
                    <p className="text-zinc-500">Not set</p>
                  )}
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Assigned Developer</p>
                  {project.assignedDeveloper ? (
                    <p>{project.assignedDeveloper}</p>
                  ) : (
                    <p className="text-zinc-500">Not assigned</p>
                  )}
                </div>
              </div>

              {/* Created/Updated Dates */}
              <div className="mt-6 pt-6 border-t border-zinc-200/50">
                <div className="grid grid-cols-2 gap-4 text-zinc-500 text-sm">
                  <div>
                    <strong>Created:</strong> {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "—"}
                  </div>
                  <div>
                    <strong>Updated:</strong> {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-zinc-200/50">
            {editing ? (
              {/* Edit Form */}
              <form
                onSubmit={handleSave}
                className="space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <label className="block text-zinc-700 text-sm mb-1">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  />
                  {errors.name && (
                    <p className="mt-1 text-zinc-600 text-sm">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2 px-3 text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              {/* View Actions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 py-2 px-2 text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 px-2 text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors text-sm"
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                >
                  Archive
                </button>
              </div>

              {/* Project Stats / Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-zinc-500 text-sm">Progress</p>
                  <p className="text-2xl font-bold text-orange-600">{project.progress}%</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Budget</p>
                  {project.budget !== null && project.budget > 0 ? (
                    <p className="text-2xl font-bold">₹{project.budget}</p>
                  ) : (
                    <p className="text-zinc-500">Not set</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Timeline</p>
                {project.timeline ? (
                  <p>{project.timeline}</p>
                ) : (
                  <p className="text-zinc-500">Not set</p>
                )}
                <p className="text-zinc-500 text-sm">Assigned Developer</p>
                {project.assignedDeveloper ? (
                  <p>{project.assignedDeveloper}</p>
                ) : (
                  <p className="text-zinc-500">Not assigned</p>
                )}
              </div>
            )
          </div>
        </div>
      </div>
    </main>
  )
}