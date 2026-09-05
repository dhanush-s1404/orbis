import { Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import prisma from "../lib/prisma"
import { authenticate, optionalAuth } from "../middleware/auth.middleware"

// Helper: validate project ownership
async function verifyProjectOwnership(projectId: string, userId: string) {
  const project = await prisma.Project.findUnique({
    where: { id: projectId },
    include: { user: true },
  })

  if (!project) {
    return { project: null, owned: false }
  }

  const owned = project.userId === userId
  return { project, owned }
}

export const projectRoutes = require("express").Router()

// GET /api/projects - List projects for authenticated user
projectRoutes.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const projects = await prisma.Project.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json(projects)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// POST /api/projects - Create a new project
projectRoutes.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { name, description, status, budget, timeline } = req.body

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Project name is required" })
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ message: "Project description is required" })
    }

    // Validate status value
    const validStatuses = ["SUBMITTED", "REVIEWING", "REQUIREMENTS_CONFIRMED", "PROPOSAL", "DEVELOPMENT", "TESTING", "CUSTOMER_REVIEW", "REVISIONS", "DEPLOYMENT", "COMPLETED", "ARCHIVED"]
    const validStatus = validStatuses.includes(status) ? status : "SUBMITTED"

    // Create project with authenticated user ownership
    const project = await prisma.Project.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        status: validStatus,
        budget: budget ?? undefined,
        timeline: timeline || undefined,
        user: { connect: { id: userId } },
      },
    })

    res.status(201).json(project)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /api/projects/:id - Get project details
projectRoutes.get("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const projectId = req.params.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify ownership first
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    res.json(project)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// PATCH /api/projects/:id - Update project
projectRoutes.patch("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const projectId = req.params.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify ownership first
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    // Only allow specific fields to be updated
    const { name, description, status, budget, timeline } = req.body
    const updateData: any = {}

    if (name !== undefined && name.trim().length > 0) {
      updateData.name = name.trim()
    }
    if (description !== undefined) {
      updateData.description = description?.trim() || undefined
    }
    if (status !== undefined) {
      updateData.status = status
    }
    if (budget !== undefined) {
      updateData.budget = budget
    }
    if (timeline !== undefined) {
      updateData.timeline = timeline
    }

    const updatedProject = await prisma.Project.update({
      where: { id: projectId },
      data: updateData,
    })

    res.json(updatedProject)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// DELETE /api/projects/:id - Delete/Archive project
projectRoutes.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const projectId = req.params.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify ownership first
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    // Soft delete: set status to ARCHIVED instead of permanent delete
    const updatedProject = await prisma.Project.update({
      where: { id: projectId },
      data: { status: "ARCHIVED" as any },
    })

    res.json({ message: "Project archived successfully", project: updatedProject })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// POST /api/projects/:id/publish - Publish a project
projectRoutes.post("/:id/publish", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const projectId = req.params.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify ownership first
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    // Validate project has builder state and template
    if (!project.builderState) {
      return res.status(400).json({ message: "Project has no builder state. Cannot publish." })
    }

    const builderState = JSON.parse(project.builderState)

    if (!builderState.templateId) {
      return res.status(400).json({ message: "Project has no template. Cannot publish." })
    }

    // Validate builder state has required data
    const { templateId, pages, styles } = builderState
    if (!pages || pages.length === 0) {
      return res.status(400).json({ message: "Project has no pages. Cannot publish." })
    }

    // Generate a slug from project name or use timestamp-based slug
    const slug = `project-${projectId}-${Date.now()}`.replace(/[^a-z0-9]/gi, "-").toLowerCase()

    // Update project with publishing info
    const updatedProject = await prisma.Project.update({
      where: { id: projectId },
      data: {
        publishStatus: "PUBLISHED",
        publishedAt: new Date(),
        publishedSlug: slug,
        publishedCount: { increment: 1 },
      },
    })

    res.json({
      project: updatedProject,
      publicUrl: `/p/${slug}`,
      message: "Project published successfully",
    })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// POST /api/projects/:id/unpublish - Unpublish a project
projectRoutes.post("/:id/unpublish", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const projectId = req.params.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify ownership first
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    // Update project to unpublish
    const updatedProject = await prisma.Project.update({
      where: { id: projectId },
      data: {
        publishStatus: "UNPUBLISHED",
        publishedAt: null,
        publishedSlug: null,
      },
    })

    res.json({
      project: updatedProject,
      message: "Project unpublished successfully. Project and builder data preserved.",
    })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /api/projects/:id/publish-status - Get publish status
projectRoutes.get("/:id/publish-status", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const projectId = req.params.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify ownership first
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    res.json({
      publishStatus: project.publishStatus,
      publishedAt: project.publishedAt,
      publishedSlug: project.publishedSlug,
      publishedCount: project.publishedCount,
      hasBuilderState: !!project.builderState,
    })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// Helper function definition moved outside router for testing use
export { verifyProjectOwnership }

export default projectRoutes