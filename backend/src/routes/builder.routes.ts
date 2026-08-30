import { Router, Request, Response } from "express"
import prisma from "../lib/prisma"
import { AuthService } from "../services/auth.service"

// Type assertion for Prisma client models - bypasses strict type checking
// for Prisma client with runtime data model resolution issues
const prisma$ = prisma as unknown as {
  Project: {
    findUnique: (args: any) => Promise<any>
    create: (args: any) => Promise<any>
    update: (args: any) => Promise<any>
    delete: (args: any) => Promise<any>
    findMany: (args: any) => Promise<any>
  }
  Template: {
    findUnique: (args: any) => Promise<any>
    findMany: (args: any) => Promise<any>
  }
}

// ✅ Declare and initialize the router FIRST, before any routes are attached to it
const builderRoutes = Router()

// Helper: validate project ownership
async function verifyProjectOwnership(projectId: string, userId: string) {
  const project = await prisma$.Project.findUnique({
    where: { id: projectId },
    include: { user: true },
  })

  if (!project) {
    return { project: null, owned: false }
  }

  const owned = project.userId === userId
  return { project, owned }
}

// POST /api/builder/create - Create a new builder project from a template
builderRoutes.post("/create", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { templateId, name, templateConfig } = req.body

    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" })
    }

    // Validate template exists
    const template = await prisma$.Template.findUnique({
      where: { id: templateId, isActive: true },
    })

    if (!template) {
      return res.status(404).json({ message: "Template not found" })
    }

    // Create project associated with template
    const project = await prisma$.Project.create({
      data: {
        name: name || `Website Project ${new Date().getFullYear()}`,
        description: "Website built using ORBIS Builder",
        status: "SUBMITTED",
        user: { connect: { id: userId } },
        templateId,
        builderState: JSON.stringify({
          templateId,
          pages: template.pages || [],
          sections: template.sections || [],
          content: template.defaultContent || {},
          styles: template.defaultStyles || {},
        }),
      },
    })

    res.status(201).json({
      project,
      message: "Builder project created successfully",
    })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /api/builder/:id - Load builder state for a project
builderRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string
    const projectId = req.params.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify ownership
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    // Return builder state
    res.json({
      project: {
        id: project.id,
        name: project.name,
        templateId: project.templateId,
        builderState: project.builderState,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// PATCH /api/builder/:id - Save builder state
builderRoutes.patch("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string
    const projectId = req.params.id
    const { builderState } = req.body

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!builderState) {
      return res.status(400).json({ message: "Builder state is required" })
    }

    // Verify ownership
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    // Update builder state
    const updatedProject = await prisma$.Project.update({
      where: { id: projectId },
      data: { builderState },
    })

    res.json({
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        builderState: updatedProject.builderState,
      },
      message: "Builder state saved successfully",
    })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /api/builder/templates - Get available templates
builderRoutes.get("/templates", async (req: Request, res: Response) => {
  try {
    const templates = await prisma$.Template.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })

    res.json(templates)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// POST /api/builder/:id/pages - Manage pages
builderRoutes.post("/:id/pages", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string
    const projectId = req.params.id
    const { action, pageData } = req.body

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify ownership
    const { project, owned } = await verifyProjectOwnership(projectId, userId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!owned) {
      return res.status(403).json({ message: "Access denied: You do not own this project" })
    }

    let updatedProject

    switch (action) {
      case "add": {
        // Add a new page to the builder state
        const currentState = project.builderState
          ? JSON.parse(project.builderState)
          : { pages: [], sections: {} }

        const newPage = {
          id: `page-${Date.now()}`,
          name: pageData?.name || "New Page",
          sections: pageData?.sections || [],
          content: pageData?.content || {},
          styles: pageData?.styles || {},
        }

        currentState.pages.push(newPage)
        updatedProject = await prisma$.Project.update({
          where: { id: projectId },
          data: { builderState: JSON.stringify(currentState) },
        })
        break
      }

      case "update": {
        // Update an existing page
        const state = JSON.parse(project.builderState || "{}")
        const pageIndex = state.pages.findIndex(
          (p: any) => p.id === pageData?.id
        )

        if (pageIndex >= 0) {
          state.pages[pageIndex] = {
            ...state.pages[pageIndex],
            name: pageData?.name,
            sections: pageData?.sections,
            content: pageData?.content,
            styles: pageData?.styles,
          }
        }

        updatedProject = await prisma$.Project.update({
          where: { id: projectId },
          data: { builderState: JSON.stringify(state) },
        })
        break
      }

      case "delete": {
        // Delete a page
        const stateDelete = JSON.parse(project.builderState || "{}")
        stateDelete.pages = stateDelete.pages.filter(
          (p: any) => p.id !== pageData?.id
        )

        updatedProject = await prisma$.Project.update({
          where: { id: projectId },
          data: { builderState: JSON.stringify(stateDelete) },
        })
        break
      }

      default:
        return res.status(400).json({ message: "Invalid action" })
    }

    res.json({
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        builderState: updatedProject.builderState,
      },
      message: "Page updated successfully",
    })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

export { verifyProjectOwnership }
export default builderRoutes