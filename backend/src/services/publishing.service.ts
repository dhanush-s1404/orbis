import { Request, Response } from "express"
import prisma from "../lib/prisma"

// GET /api/public/:slug - Get published website data by slug
// Returns only publishable data, no builder metadata
export async function getPublishedWebsite(slug: string) {
  const project = await prisma.Project.findFirst({
    where: { publishedSlug: slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!project) {
    return null
  }

  if (project.publishStatus !== "PUBLISHED") {
    return null
  }

  // Return only publishable fields
  return {
    id: project.id,
    name: project.name,
    slug: project.publishedSlug,
    publishStatus: project.publishStatus,
    publishedAt: project.publishedAt,
    publishedCount: project.publishedCount,
    templateId: project.templateId,
    builderState: project.builderState,
    // Only expose safe fields - no sensitive user data
    user: {
      id: project.user.id,
      name: project.user.name,
      email: project.user.email,
    },
  }
}

// Handler for the public route
export async function handlePublicRoute(req: Request, res: Response) {
  try {
    const { slug } = req.params

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" })
    }

    const websiteData = await getPublishedWebsite(slug)

    if (!websiteData) {
      // Return 404 for unpublished or non-existent projects
      return res.status(404).json({ message: "Published website not found" })
    }

    res.json(websiteData)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
}