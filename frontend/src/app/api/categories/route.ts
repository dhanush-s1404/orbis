import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000'}/api/categories`, {
    cache: 'no-store',
  })
  const categories = await res.json()
  return NextResponse.json(categories)
}