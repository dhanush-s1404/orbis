import { Request, Response } from "express"
import prisma from "../lib/prisma"

export const categoryRoutes = require("express").Router()

// GET /api/categories - List all categories with product counts
categoryRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: { status: "ACTIVE" },
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
            slug: true,
            featured: true,
          },
          take: 6,
        },
      },
      orderBy: { name: "asc" },
    })

    // Transform to include product count
    const transformed = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      productCount: category.products.length,
      featuredProducts: category.products
        .filter((p) => p.featured)
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          discountPrice: p.discountPrice,
          slug: p.slug,
        })),
    }))

    res.json(transformed)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /api/categories/:slug - List products in a specific category
categoryRoutes.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const { page = 1, limit = 12, sort = "latest" } = req.query

    const where = {
      category: { slug },
      status: "ACTIVE",
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, images: true, features: true },
        orderBy: sort === "latest" ? { createdAt: "desc" } : sort === "price-low" ? { price: "asc" } : sort === "price-high" ? { price: "desc" } : { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / Number(limit))

    res.json({ products, total, page: Number(page), totalPages, categorySlug: slug })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

export default categoryRoutes