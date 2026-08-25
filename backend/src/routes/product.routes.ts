import { Request, Response } from "express"
import PrismaClient from "@prisma/client"

const prisma = new PrismaClient()

export const productRoutes = require("express").Router()

// GET /api/products - List products with search, filter, sort, pagination
productRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 12, sort = "latest" } = req.query
    const where: any = {}

    // Category filter
    if (category) {
      where.category = { slug: String(category) }
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { shortDescription: { contains: String(search), mode: "insensitive" } },
        { fullDescription: { contains: String(search), mode: "insensitive" } },
      ]
    }

    // Status filter
    if (status) {
      where.status = status
    }

    const skip = (Number(page) - 1) * Number(limit)

    const orderBy: any = {}
    if (sort === "price-low") {
      orderBy.price = "asc"
    } else if (sort === "price-high") {
      orderBy.price = "desc"
    } else if (sort === "name-a") {
      orderBy.name = "asc"
    } else if (sort === "name-z") {
      orderBy.name = "desc"
    } else {
      // default: latest
      orderBy.createdAt = "desc"
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, images: true, features: true },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / Number(limit))

    res.json({ products, total, page: Number(page), totalPages })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /api/products/:slug - Get single product by slug
productRoutes.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, images: true, features: true },
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// POST /api/products - Create a new product
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

    res.status(201).json(product)
  } catch (error: any) {
    // Duplicate slug
    if (error.message && error.message.includes("unique constraint")) {
      return res.status(409).json({ message: "A product with this slug already exists" })
    }
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /api/products/featured - Get featured products
productRoutes.get("/featured", async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true, status: "ACTIVE" },
      include: { category: true, images: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    })

    res.json(products)
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

export default productRoutes