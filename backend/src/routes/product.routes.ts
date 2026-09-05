
import { Request, Response, Router } from "express"
import prisma from "../lib/prisma"

const productRoutes = Router()

// GET /api/products - List products with search, filter, sort, pagination
productRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      status,
      featured,
      page = 1,
      limit = 12,
      sort = "latest",
    } = req.query

    const where: any = {}

    // Category filter
    if (category) {
      where.category = {
        slug: String(category),
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        {
          name: {
            contains: String(search),
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: String(search),
            mode: "insensitive",
          },
        },
        {
          fullDescription: {
            contains: String(search),
            mode: "insensitive",
          },
        },
      ]
    }

    // Status filter
    if (status) {
      where.status = String(status)
    }

    // Featured filter
    if (featured !== undefined) {
      where.featured = String(featured).toLowerCase() === "true"
    }
    
    const pageNumber = Math.max(Number(page) || 1, 1)
    const limitNumber = Math.min(
      Math.max(Number(limit) || 12, 1),
      100
    )

    const skip = (pageNumber - 1) * limitNumber

    let orderBy: any = {
      createdAt: "desc",
    }

    if (sort === "price-low") {
      orderBy = {
        price: "asc",
      }
    } else if (sort === "price-high") {
      orderBy = {
        price: "desc",
      }
    } else if (sort === "name-a") {
      orderBy = {
        name: "asc",
      }
    } else if (sort === "name-z") {
      orderBy = {
        name: "desc",
      }
    } else if (sort === "featured") {
      orderBy = {
        featured: "desc",
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
          features: true,
        },
        orderBy,
        skip,
        take: limitNumber,
      }),

      prisma.product.count({
        where,
      }),
    ])

    const totalPages = Math.ceil(total / limitNumber)

    return res.json({
      products,
      total,
      page: pageNumber,
      totalPages,
    })
  } catch (error: any) {
    console.error("PRODUCT LIST ERROR:", error)

    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
    })
  }
})

// GET /api/products/featured
productRoutes.get("/featured", async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        status: "ACTIVE",
      },
      include: {
        category: true,
        images: true,
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.json(products)
  } catch (error: any) {
    console.error("FEATURED PRODUCTS ERROR:", error)

    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
    })
  }
})

// GET /api/products/:slug
productRoutes.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
        images: true,
        features: true,
      },
    })

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    return res.json(product)
  } catch (error: any) {
    console.error("GET PRODUCT ERROR:", error)

    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
    })
  }
})

// POST /api/products
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
    console.error("CREATE PRODUCT ERROR:", error)

    if (
      error?.message &&
      error.message.toLowerCase().includes("unique constraint")
    ) {
      return res.status(409).json({
        message: "A product with this slug already exists",
      })
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
    })
  }
})

export { productRoutes }

export default productRoutes
