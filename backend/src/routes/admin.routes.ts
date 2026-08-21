import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get counts for admin dashboard
    const [users, products, orders, projects, notifications] = await Promise.all([
      prisma.user.findMany({ select: { role: true, _count: true } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.customProject.count(),
      prisma.notification.findMany({
        where: { read: false },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    ])

    // Calculate stats
    const totalUsers = users.reduce((sum, user) => sum + user._count, 0)
    const adminCount = users.filter((u) => u.role === "ADMIN").length
    const customerCount = users.filter((u) => u.role === "CUSTOMER").length
    const developerCount = users.filter((u) => u.role === "DEVELOPER").length

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      include: { user: true, orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get recent projects
    const recentProjects = await prisma.customProject.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        adminCount,
        customerCount,
        developerCount,
        totalProducts: products,
        totalOrders: orders,
        totalProjects: projects,
      },
      recentOrders,
      recentProjects,
      unreadNotifications: notifications.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch admin data", error: error.message },
      { status: 500 }
    )
  }
}