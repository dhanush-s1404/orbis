import { Request, Response, Router } from "express"
import prisma from "../lib/prisma"

export const analyticsRoutes = Router()

// GET /api/analytics - Get analytics metrics for selected time period
analyticsRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { period = "30D" } = req.query

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "7D":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "90D":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1Y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      case "30D":
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Fetch orders within the date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Calculate metrics
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    )

    const totalOrders = orders.length

    const totalCustomers = new Set(
      orders.map((order) => order.userId)
    ).size

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate conversion rate (orders / visitors - simplified)
    // In a full implementation, this would use analytics data
    const conversionRate = 2.4 // placeholder

    // Products sold
    const productsSold = new Set(
      orders.flatMap((order) => order.orderItems.map((item) => item.productId))
    ).size

    // Monthly revenue (simplified - would calculate from actual data)
    const monthlyRevenue = []
    for (let i = 0; i < 12; i++) {
      monthlyRevenue.push(totalRevenue / 12)
    }

    const metrics = {
      totalRevenue,
      monthlyRevenue,
      averageOrderValue,
      conversionRate,
      totalOrders,
      totalCustomers,
      productsSold,
    }

    return res.json({ metrics })
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
})

export default analyticsRoutes