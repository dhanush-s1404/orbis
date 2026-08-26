import "dotenv/config"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import prisma from "./lib/prisma"
import productRoutes from "./routes/product.routes"
import authRoutes from "./routes/auth.routes"
import categoryRoutes from "./routes/category.routes"
import orderRoutes from "./routes/order.routes"
import projectRoutes from "./routes/project.routes"
import builderRoutes from "./routes/builder.routes"
import adminRoutes from "./routes/admin.routes"
import { errorHandler } from "./middleware/error.middleware"

const app = express()

// Security headers via Helmet
app.use(helmet())

// CORS configuration - use frontend URL from env, restrict in production
const corsOrigin = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
const isDevelopment = process.env.NODE_ENV !== "production"

app.use(
  cors({
    origin: isDevelopment ? "*" : corsOrigin,
    credentials: true,
    optionsSuccessStatus: 200,
  })
)
app.use(express.json({ limit: "10mb" }))

// Rate limiting basic
interface RateLimitCache {
  [key: string]: number
}

const rateLimit = (req: any, res: any, next: any) => {
  const now = Date.now()
  const { ip } = req
  // Simple in-memory rate limit
  const cache: RateLimitCache = rateLimit.cache || {}
  const ipKey = ip || "unknown"
  const lastReq = cache[ipKey] || 0
  if (now - lastReq < 1000) {
    const count = (cache[ipKey + "_count"] || 1) + 1
    cache[ipKey + "_count"] = count
    if (count > 10) return res.status(429).json({ message: "Too many requests" })
  } else {
    cache[ipKey] = now
    cache[ipKey + "_count"] = 1
  }
  ;(rateLimit as any).cache = cache
  next()
}

app.use(rateLimit)

// Routes
app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/builder", builderRoutes)
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

export { prisma }