
import { Request, Response } from "express"
import prisma from "../lib/prisma"

export const customerRoutes = require("express").Router()

// GET /api/customers - List all customers with order summary
customerRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        orders: {
          include: {
            orderItems: {
              include: { product: true },
            },
          },
        },
        auditLogs: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    const summary = customers.map((user) => {
      const totalOrders = user.orders?.length || 0

      const totalSpending =
        user.orders?.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        ) || 0

      const lastOrder =
        user.orders
          ?.sort(
            (a: any, b: any) =>
              b.createdAt.getTime() - a.createdAt.getTime()
          )[0] || null

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        totalOrders,
        totalSpending,
        lastOrder: lastOrder
          ? {
              id: lastOrder.id,
              date: lastOrder.createdAt,
              total: lastOrder.total,
              status: lastOrder.orderStatus,
            }
          : null,
      }
    })

    return res.json(summary)
  } catch (error: any) {
    console.error("Customer list error:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET /api/customers/:id - Get customer detail with order history
customerRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const customerId = req.params.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // In a full implementation, would check ownership
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          include: {
            orderItems: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        auditLogs: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const totalOrders = customer.orders?.length || 0

    const totalSpending =
      customer.orders?.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      ) || 0

    return res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: customer.role,
      totalOrders,
      totalSpending,
      credits: customer.credits,

      orderHistory:
        customer.orders?.map((order: any) => ({
          id: order.id,
          date: order.createdAt,
          total: order.total,
          status: order.orderStatus,
          paymentStatus: order.paymentStatus,
          items:
            order.orderItems?.map((item: any) => ({
              productId: item.productId,
              productName: item.product?.name,
              quantity: item.quantity,
              price: item.price,
            })) || [],
        })) || [],

      recentActivity:
        customer.auditLogs?.map((log: any) => ({
          action: log.action,
          timestamp: log.createdAt,
          details: log.details,
        })) || [],
    })
  } catch (error: any) {
    console.error("Customer detail error:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
})

export default customerRoutes

