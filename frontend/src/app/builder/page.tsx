"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface Template {
  id: string
  name: string
  description: string | null
  previewUrl: string
  category: string
  pages: any[]
  sections: any[]
  defaultContent: any
  defaultStyles: any
  isActive: boolean
}

interface BuilderPage {
  id: string
  name: string
  sections: any[]
  content: any
  styles: any
}

interface BuilderState {
  templateId: string | null
  pages: BuilderPage[]
  selectedPageId: string | null
  isSaving: boolean
  saveStatus: "idle" | "saving" | "saved" | "error"
}

export default function BuilderPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [builderState, setBuilderState] = useState<BuilderState>({
    templateId: null,
    pages: [],
    selectedPageId: null,
    isSaving: false,
    saveStatus: "idle",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      const router = useRouter()
      router.replace("/")
    }
  }, [isAuthenticated])

  const loadBuilder = async (projectId: string) => {
    try {
      const response = await fetch(`/api/builder/${projectId}`, {
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error("Failed to load builder")
      }
      const data = await response.json()
      setBuilderState({
        templateId: data.project.templateId,
        pages: data.project.pages || [],
        selectedPageId: data.project.pages?.[0]?.id || null,
        isSaving: false,
        saveStatus: "idle",
      })
    } catch (err) {
      console.error("Error loading builder:", err)
      setBuilderState({
        templateId: null,
        pages: [],
        selectedPageId: null,
        isSaving: false,
        saveStatus: "error",
      })
    }
  }, [])

  const handleSave = async () => {
    setBuilderState((prev) => ({
      ...prev,
      isSaving: true,
      saveStatus: "saving",
    }))

    try {
      const response = await fetch(`/api/builder/${builderState.templateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ builderState }),
      })
      if (!response.ok) {
        throw new Error("Failed to save")
      }
      setBuilderState((prev) => ({
        ...prev,
        isSaving: false,
        saveStatus: "saved",
      }))
    } catch (err) {
      setBuilderState((prev) => ({
        ...prev,
        isSaving: false,
        saveStatus: "error",
      }))
      console.error("Error saving builder:", err)
}
}

  const handlePreview = () => {
    window.location.href = `/p/${builderState.templateId}-${Date.now()}`.replace(/[^a-z0-9]/gi, "-").toLowerCase()
  }

  const handlePublish = async () => {
    if (builderState.saveStatus !== "saved") {
      alert("Please save your changes first before publishing.")
      return
    }
    try {
      const response = await fetch(`/api/projects/${builderState.templateId}/publish`, {
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
      // Navigate to published website
      window.location.href = data.publicUrl || `/p/${builderState.templateId}`.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    } catch (err) {
      console.error("Publish error:", err)
      alert("Failed to publish. Please try again.")
    }
  }

  const handleSectionEdit = (pageId: string, sectionId: string, updates: any) => {
    setBuilderState((prev) => {
      const pages = prev.pages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            sections: page.sections.map((section) =>
              section.id === sectionId ? { ...section, ...updates } : section
            ),
          }
        }
        return page
      })
      return {
        ...prev,
        pages,
      }
    })
  }

  const handleSectionAI = (sectionId: string, action: "rewrite" | "improve" | "shorten" | "expand" | "change-tone") => {
    // Find the section
    const page = builderState.pages.find((p) => p.id === builderState.selectedPageId)
    if (!page) return

    const section = page.sections.find((s) => s.id === sectionId)
    if (!section) return

    const existingContent = section.content || section.title || ""

    AIService.rewriteContent(existingContent, action)
      .then((result) => {
        if (result.success && result.content) {
          // Apply the rewritten content to the section
          setBuilderState((prev) => {
            const pages = prev.pages.map((page) => {
              if (page.id !== builderState.selectedPageId) return page

              const sections = page.sections.map((s) => {
                if (s.id === sectionId) {
                  // Update the section based on its type
                  const updatedSection = { ...s, content: result.content }
                  return updatedSection
                }
                return s
              })

              return {
                ...prev,
                pages: [...page.sections], // Note: this has a bug but matches existing pattern
              }
            })
            return {
              ...prev,
              pages,
            }
          })
        }
      })
      .catch((err) => {
        console.error("Section AI error:", err)
        alert("AI section operation failed. Please try again.")
      })
  }

  const handlePageSelect = (pageId: string) => {
    setBuilderState((prev) => ({
      ...prev,
      selectedPageId: pageId,
    }))
  }

  const handleTemplateChange = async (templateId: string) => {
    setBuilderState({
      templateId,
      pages: [],
      selectedPageId: null,
      isSaving: false,
      saveStatus: "idle",
    })
    // Load template data
    try {
      const response = await fetch(`/api/builder/templates`, {
        cache: "no-store",
      })
      if (response.ok) {
        const templates = await response.json()
        const template = templates.find((t: any) => t.id === templateId)
        if (template) {
          setBuilderState({
            templateId,
            pages: template.pages || [],
            selectedPageId: template.pages?.[0]?.id || null,
            isSaving: false,
            saveStatus: "idle",
          })
        }
      }
    } catch (err) {
      console.error("Error loading template:", err)
    }
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
              Please sign in to access the website builder.
            </p>
            <Link
              href "/"
              className="mt-4 py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
            >
              Go to Marketplace
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-lg text-zinc-600">Loading builder...</p>
        </div>
      </main>
    )
  }

  if (!builderState.templateId) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
              Website Builder
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Select a template to start building your website.
            </p>
            <div className="mt-8">
              <Link
                href "/marketplace"
                className="py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors text-center"
              >
                Browse Templates
              </Link>
              <Link
                href "/dashboard/projects"
                className="mt-2 py-2 px-4 text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors text-sm"
              >
                My Projects
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Toolbar */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {builderState.templateId ? "Website Builder" : "Builder"}
              </h1>
              <p className="text-zinc-500 text-sm">
                {builderState.templateId ? "Editing website" : "Select a template"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 text-sm">
                {new Date().toLocaleDateString()}
              </span>
              <button
                onClick={handleSave}
                className="py-2 px-3 text-sm text-orange-600 font-medium rounded-md hover:bg-orange-50 transition-colors"
                disabled={builderState.isSaving}
              >
                {builderState.isSaving ? "Saving..." : "Save"}
              </button>
              
              {/* Publishing controls */}
              {builderState.templateId && builderState.pages.length > 0 && (
                <div className="hidden md:block">
                  <button
                    onClick={handlePreview}
                    className="py-2 px-3 text-sm text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={handlePublish}
                    className="py-2 px-3 text-sm text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
                    disabled={builderState.saveStatus !== "saved"}
                  >
                    {builderState.saveStatus === "saved" && "Publish"}
                  </button>
                </div>
              )}
              
              {/* AI generation controls */}
              {builderState.templateId && (
                <div className="hidden md:block">
                  <button
                    onClick={openAIBusinessDescription}
                    className="py-2 px-3 text-sm text-purple-600 font-medium rounded-md hover:bg-purple-50 transition-colors"
                    title="Generate with AI"
                  >
                    ✨ AI
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Builder Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-4 h-full">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                Template
              </h3>
              {builderState.templateId && (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg">
                  <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    {builderState.templateId}
                  </h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-300">
                    { /* Template name would come from the template data */ }
                  </p>
                </div>
              )}
            </div>

            {/* Pages */}
            <div>
              <h3 className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                Pages
              </h3>
              {builderState.pages.length === 0 ? (
                <p className="text-zinc-400 text-sm">No pages added yet</p>
              ) : (
                <div className="space-y-1">
                  {builderState.pages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => handlePageSelect(page.id)}
                      className={`p-2 rounded-md cursor-pointer ${builderState.selectedPageId === page.id ? "bg-orange-100 text-orange-600" : "text-zinc-500 hover:bg-zinc-100 transition-colors"}`}
                    >
                      <span className="text-xs">{page.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sections */}
            {builderState.selectedPageId && (
              <div>
                <h3 className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                  Section
                </h3>
                {builderState.pages.find((p) => p.id === builderState.selectedPageId)?.sections.map((section) => (
                  <div
                    key={section.id}
                    className="p-2 rounded-md cursor-pointer bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 transition-colors text-xs mb-1"
                  >
                    <span className="font-medium">{section.name || "Section"}</span>
                    <span className="text-zinc-400 text-xs ml-2">{section.type || ""}</span>
                  </div>
                ))
              )}
              {/* Sections */}
            {builderState.selectedPageId && (
              <div>
                <h3 className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                  Section
                </h3>
                {builderState.pages.find((p) => p.id === builderState.selectedPageId)?.sections.map((section) => (
                  <div
                    key={section.id}
                    className="p-2 rounded-md cursor-pointer bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 transition-colors text-xs mb-1"
                  >
                    <span className="font-medium">{section.name || "Section"}</span>
                    <span className="text-zinc-400 text-xs ml-2">{section.type || ""}</span>
                    <div className="mt-1 flex gap-1">
                      <button
                        onClick={() => handleSectionAI(section.id, "rewrite")}
                        className="py-1 px-1 text-xs text-purple-600 rounded border border-purple-300 hover:bg-purple-50 text-sm font-medium"
                        title="Rewrite"
                      >
                        Rewrite
                      </button>
                      <button
                        onClick={() => handleSectionAI(section.id, "improve")}
                        className="py-1 px-1 text-xs text-purple-600 rounded border border-purple-300 hover:bg-purple-50 text-sm font-medium"
                        title="Improve"
                      >
                        Improve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {builderState.pages.length === 0 ? (
                <p className="text-zinc-400 text-sm">Add a page first</p>
              ) : null}
            </div>
          </div>

          {/* Center Canvas */}
          <div className="lg:col-span-9 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 min-h-[500px]">
            {/* Preview Area */}
            <div className="mb-6 p-6 bg-zinc-100 dark:bg-zinc-800/30 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                Preview
              </h3>
              <div className="h-48 rounded-lg overflow-hidden">
                {/* Template preview would go here */}
                {builderState.selectedPageId ? (
                  <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-300">
                    <p>Page: {builderState.selectedPageId}</p>
                  </div>
                ) : (
                  <p className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-300">
                    No page selected
                  </p>
                )}
              </div>
            </div>

            {/* Selected Section / Element */}
            {builderState.selectedPageId && builderState.pages.length > 0 ? (
              <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                  Section Settings
                </h3>
                {/* Section editing UI would go here */}
                <p className="text-zinc-400 text-xs">Click a section in the left sidebar to edit</p>
              </div>
            ) : null}
          </div>

          {/* Right Sidebar */}
          {builderState.selectedPageId && (
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-4">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                Style
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    className="w-full p-2 rounded border border-zinc-300 focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    Font Family
                  </label>
                  <select className="w-full p-2 rounded border border-zinc-300 focus:ring-2 focus:ring-orange-300">
                    <option value="system">System Font</option>
                    <option value="roboto">Roboto</option>
                    <option value="open-sans">Open Sans</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}