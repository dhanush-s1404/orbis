import { NextResponse } from "next/server"

export async function GET() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const res = await fetch(`${apiBase}/api/categories`, {
    cache: 'no-store',
  })
  const categories = await res.json()
  return NextResponse.json(categories)
}