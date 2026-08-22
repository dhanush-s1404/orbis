import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")
  const sort = searchParams.get("sort") || "latest"

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000'}/api/products?category=${category}&search=${search}&page=${page}&limit=${limit}&sort=${sort}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000'}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const product = await res.json()
  return NextResponse.json(product, { status: 201 })
}