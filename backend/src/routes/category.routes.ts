import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const categoryRoutes = require("express").Router()

categoryRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          take: 3,
          where: { status: "ACTIVE" },
        },
      },
      orderBy: { name: "asc" },
    })

    return res.json(categories)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

export default categoryRoutes