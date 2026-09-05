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
import customerRoutes from "./routes/customer.routes"
import { analyticsRoutes } from "./routes/analytics.routes"
import { errorHandler } from "./middleware/error.middleware"

const app = express()

// Security headers via Helmet
app.use(helmet())

// CORS configuration - support development and production
// In development: allow local origins
// In production: require explicit FRONTEND_URL environment variable
const allowedOrigins = isDevelopment
  ? ["http://localhost:3000", "http://localhost:4000", "http://127.0.0.1:3000"]
  : [corsOrigin]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  })
)
app.use(express.json({ limit: "10mb" }))

// Rate limiting using express-rate-limit for proper handling
const limit = require("express-rate-limit")

// Base rate limiter - 100 requests per 15 minutes
const baseLimiter = limit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Stricter limiter for auth endpoints - 5 requests per 15 minutes
const authLimiter = limit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: "Too many authentication attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
})

// Stricter limiter for sensitive operations - 30 requests per 15 minutes
const sensitiveLimiter = limit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiters to specific routes
app.use(baseLimiter) // Apply base limiter to all routes
app.use("/api/auth", authLimiter) // Auth endpoints
app.use("/api/projects", sensitiveLimiter) // Project endpoints
app.use("/api/builder", sensitiveLimiter) // Builder endpoints

// Routes
app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/builder", builderRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`)
  console.log(`📅 Database: ${process.env.DATABASE_URL?.split("@")[1] || "localhost"}`)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...")
  await prisma.$disconnect()
  server.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...")
  await prisma.$disconnect()
  server.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})

export { prisma }