import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const productRoutes = require("express").Router()

productRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 12, sort = "latest" } = req.query
    const where: any = {}

    if (category) {
      where.category = { slug: String(category) }
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { shortDescription: { contains: String(search), mode: "insensitive" } },
        { fullDescription: { contains: String(search), mode: "insensitive" } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, images: true, features: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / Number(limit))

    return res.json({ products, total, page: Number(page), totalPages })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

productRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        price: body.price,
        discountPrice: body.discountPrice,
        categoryId: body.categoryId,
        demoUrl: body.demoUrl,
        status: body.status || "ACTIVE",
        featured: body.featured || false,
        license: body.license || "standard",
      },
    })

    return res.status(201).json(product)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

export default productRoutes