import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const orderRoutes = require("express").Router()

orderRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    })

    return res.json(orders)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

orderRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body
    const userId = (req as any).user?.id

    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        paymentStatus: "UNPAID",
        totalAmount,
        paymentMethod,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: { include: { product: true } } },
    })

    return res.status(201).json(order)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

export default orderRoutes