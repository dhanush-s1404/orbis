import { Request, Response } from "express"
import PrismaClient from "@prisma/client"

const prisma = new PrismaClient()

export const adminRoutes = require("express").Router()

adminRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const [users, products, orders, projects, notifications] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.project.count(),
      prisma.notification.findMany({ where: { read: false }, take: 10, orderBy: { createdAt: "desc" } }),
    ])

    const totalUsers = users.length
    const adminCount = users.filter((u) => u.role === "ADMIN").length
    const customerCount = users.filter((u) => u.role === "CUSTOMER").length
    const developerCount = users.filter((u) => u.role === "DEVELOPER").length

    const recentOrders = await prisma.order.findMany({
      include: { user: true, orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    const recentProjects = await prisma.project.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return res.json({
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
    return res.status(500).json({
      message: "Failed to fetch admin data",
      error: error.message,
    })
  }
})

export default adminRoutes