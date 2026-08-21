import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")
  const sort = searchParams.get("sort") || "latest"

  const where: any = {}

  if (category) {
    where.category = {
      slug: category,
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
      { fullDescription: { contains: search, mode: "insensitive" } },
    ]
  }

  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        features: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return NextResponse.json({
    products,
    total,
    page,
    totalPages,
  })
}

export async function POST(request: Request) {
  const body = await request.json()

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

  return NextResponse.json(product, { status: 201 })
}