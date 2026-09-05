import { Router, Request, Response } from "express"
import prisma from "../lib/prisma"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100)

    const [users, products, orders, projects, notifications] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, status: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.project.count(),
      prisma.notification.findMany({
        where: { read: false },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
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
      page,
      totalPages: Math.ceil(/* would need individual counts */ 0), // simplified
      users,
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch admin data",
      error: error.message,
    })
  }
})

export default router