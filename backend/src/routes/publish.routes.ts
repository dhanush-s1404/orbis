import { Request, Response } from "express"
import { handlePublicRoute } from "../services/publishing.service"

const publishRoutes = require("express").Router()

// GET /api/publish/:slug - Get published website data by slug
publishRoutes.get("/:slug", async (req: Request, res: Response) => {
  try {
    await handlePublicRoute(req, res)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /p/:slug - Public route for published website (Next.js client-side)
// This is handled on the frontend, but we also provide an API fallback
publishRoutes.get("/:slug", async (req: Request, res: Response) => {
  // This endpoint is primarily for API usage
  // The frontend Next.js page /published/[slug] will handle client-side rendering
  await handlePublicRoute(req, res)
})

export default publishRoutes