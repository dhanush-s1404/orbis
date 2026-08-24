import { Request, Response } from "express"
import PrismaClient from "@prisma/client"

const prisma = new PrismaClient()

export const projectRoutes = require("express").Router()

projectRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const projects = await prisma.customProject.findMany({
      where: { userId },
      include: {
        projectMessages: true,
        projectFiles: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return res.json(projects)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

projectRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, businessName, websiteType, industry, businessDescription, targetAudience, requiredPages, requiredFeatures, designPreferences, referenceWebsites, existingWebsite, budget, timeline, additionalRequirements } = req.body
    const userId = (req as any).user?.id

    const project = await prisma.customProject.create({
      data: {
        status: "SUBMITTED",
        name,
        email,
        phone,
        businessName,
        websiteType,
        industry,
        businessDescription,
        targetAudience,
        requiredPages,
        requiredFeatures,
        designPreferences,
        referenceWebsites,
        existingWebsite,
        budget,
        timeline,
        additionalRequirements,
        user: { connect: { id: userId } },
      },
      include: {
        projectMessages: true,
        projectFiles: true,
      },
    })

    return res.status(201).json(project)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

export default projectRoutes