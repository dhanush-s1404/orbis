import { Request, Response } from "express"
import prisma from "../lib/prisma"

export const orderRoutes = require("express").Router()

orderRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any)?.user?.id
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    })

    return res.json(orders)
  } catch (error) {
    console.error("ORDER LIST ERROR:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
})

orderRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body
    const userId = (req as any)?.user?.id

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" })
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.productId) {
        return res.status(400).json({ message: "Each order item must have a product ID" })
      }
      if (item.quantity === undefined || item.quantity <= 0) {
        return res.status(400).json({ message: "Each order item must have a valid quantity" })
      }
    }

    // Fetch product prices from database - never trust client-supplied prices
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })
    const priceMap = new Map(products.map((p) => [p.id, p.price]))

    // Validate prices server-side and calculate total
    let calculatedTotal = 0
    for (const item of items) {
      const productPrice = priceMap.get(item.productId)
      if (productPrice === undefined) {
        return res.status(400).json({ message: `Product ${item.productId} not found` })
      }
      calculatedTotal += productPrice * item.quantity
    }

    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        paymentStatus: "UNPAID",
        totalAmount: calculatedTotal,
        paymentMethod,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: priceMap.get(item.productId),
          })),
        },
      },
      include: { orderItems: { include: { product: true } } },
    })

    return res.status(201).json(order)
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
})

export default orderRoutes