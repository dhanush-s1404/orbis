import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { AIService, AIBusinessProfile, AISectionContent, AIGenerationMetadata, AIGenerateResponse } from "../services/ai.service"

const prisma = new PrismaClient()

// POST /api/ai/generate - Generate AI website content
// Requires authentication, validated business profile, template sections
export async function handleAIGenerate(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { profile, templateSections } = req.body

    if (!profile || !templateSections || templateSections.length === 0) {
      return res.status(400).json({ message: "Business profile and template sections are required" })
    }

    // Validate profile fields
    const validationErrors: string[] = []

    if (profile.businessName?.trim().length === 0) {
      validationErrors.push("Business name is required")
    }

    if (profile.description?.trim().length < 10) {
      validationErrors.push("Description must be at least 10 characters")
    }

    if (profile.description?.trim().length > 500) {
      validationErrors.push("Description must be less than 500 characters")
    }

    if (profile.services?.length === 0) {
      validationErrors.push("At least one service must be specified")
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors: validationErrors })
    }

    // Template-aware generation: limit sections based on template
    // In production, fetch template definition and filter sections
    const allowedSections = templateSections.filter(
      (s: string) => 
        s === "hero" || s === "features" || s === "about" || 
        s === "services" || s === "cta" || s === "footer" ||
        s === "testimonials" || s === "pricing" || s === "contact"
    )

    // Generate content using configured provider
    const response = await AIService.generateWebsiteContent(profile, allowedSections)

    if (!response.success) {
      return res.status(500).json({ message: "AI generation failed", errors: response.errors })
    }

    // Persist AI usage record
    await prisma.aIUsage.create({
      data: {
        project: { connect: { id: userId } },
        businessName: profile.businessName,
        industry: profile.industry,
        targetAudience: profile.targetAudience,
        goal: profile.goal,
        tone: profile.tone,
        services: profile.services,
        generationCount: 1,
      },
    })

    res.json({
      success: true,
      profile: response.profile,
      sections: response.sections,
      styleSuggestions: response.styleSuggestions,
      metadata: response.metadata,
    })
  } catch (error: any) {
    console.error("AI generation error:", error)
    res.status(500).json({ message: "Internal Server Error", errors: [error.message] })
  }
}

// POST /api/ai/rewrite - Rewrite existing content with AI
// Requires authentication, existing content, and instruction
export async function handleAIRewrite(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { existingContent, instruction } = req.body

    if (!existingContent || !instruction) {
      return res.status(400).json({ message: "Existing content and instruction are required" })
    }

    if (existingContent.trim().length === 0) {
      return res.status(400).json({ message: "Existing content cannot be empty" })
    }

    if (instruction.trim().length === 0) {
      return res.status(400).json({ message: "Instruction cannot be empty" })
    }

    // Limit instruction length
    if (instruction.trim().length > 200) {
      return res.status(400).json({ message: "Instruction must be less than 200 characters" })
    }

    const result = await AIService.rewriteContent(existingContent, instruction)

    if (!result.success) {
      return res.status(500).json({ message: "AI rewrite failed", error: result.error })
    }

    res.json({
      success: true,
      content: result.content,
    })
  } catch (error: any) {
    console.error("AI rewrite error:", error)
    res.status(500).json({ message: "Internal Server Error", errors: [error.message] })
  }
}

// GET /api/ai/history - Get AI generation history for user projects
export async function handleAIHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const history = await prisma.aIUsage.findMany({
      where: { project: { userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        businessName: true,
        industry: true,
        goal: true,
        tone: true,
        generationCount: true,
        createdAt: true,
      },
    })

    res.json({ history })
  } catch (error: any) {
    console.error("AI history error:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// GET /api/ai/status - Check AI provider status
export async function handleAIStatus(req: Request, res: Response) {
  const provider = AIService.getProvider()

  if (!provider) {
    return res.json({
      providerConfigured: false,
      status: "no_provider",
      message: "AI provider not configured. Contact administrator to enable AI features.",
    })
  }

  return res.json({
    providerConfigured: true,
    status: "ready",
    message: "AI provider is configured and ready.",
  })
}

export const aiRoutes = require("express").Router()

aiRoutes.post("/generate", async (req: Request, res: Response) => {
  try {
    await handleAIGenerate(req, res)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

aiRoutes.post("/rewrite", async (req: Request, res: Response) => {
  try {
    await handleAIRewrite(req, res)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

aiRoutes.get("/history", async (req: Request, res: Response) => {
  try {
    await handleAIHistory(req, res)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

aiRoutes.get("/status", async (req: Request, res: Response) => {
  try {
    await handleAIStatus(req, res)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})