import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        take: 3,
        where: { status: "ACTIVE" },
      },
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(categories)
}