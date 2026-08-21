import "dotenv/config"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import productRoutes from "./src/routes/product.routes"
import authRoutes from "./src/routes/auth.routes"
import categoryRoutes from "./src/routes/category.routes"
import orderRoutes from "./src/routes/order.routes"
import projectRoutes from "./src/routes/project.routes"
import adminRoutes from "./src/routes/admin.routes"
import errorHandler from "./src/middleware/error.middleware"

const prisma = new PrismaClient()
const app = express()

// Security middleware
app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }))
app.use(express.json({ limit: "10mb" }))

// Rate limiting basic
const rateLimit = (req: any, res: any, next: any) => {
  const now = Date.now()
  const { ip } = req
  // Simple in-memory rate limit
  if (!rateLimit.cache) rateLimit.cache = {}
  const ipKey = ip || "unknown"
  const lastReq = rateLimit.cache[ipKey] || 0
  if (now - lastReq < 1000) {
    const count = (rateLimit.cache[ipKey + "_count"] || 1) + 1
    rateLimit.cache[ipKey + "_count"] = count
    if (count > 10) return res.status(429).json({ message: "Too many requests" })
  } else {
    rateLimit.cache[ipKey] = now
    rateLimit.cache[ipKey + "_count"] = 1
  }
  next()
}

app.use(rateLimit)

// Routes
app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/admin", adminRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`)
  console.log(`📅 Database: ${process.env.DATABASE_URL?.split("@")[1] || "localhost"}`)
})

export { app, prisma }