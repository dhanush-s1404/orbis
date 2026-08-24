import { Request, Response } from "express"
import { AuthService } from "../services/auth.service"

export const authRoutes = require("express").Router()

// Helper: validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

authRoutes.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    // Validate inputs
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" })
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" })
    }

    if (!password || password.trim().length === 0) {
      return res.status(400).json({ message: "Password is required" })
    }

    // Check minimum password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Check password confirmation if provided
    // Note: frontend should handle confirmation, but we validate here too

    // Normalize email to lowercase to prevent duplicate accounts
    const normalizedEmail = email.toLowerCase().trim()

    const result = await AuthService.register(name, normalizedEmail, password)
    res.status(201).json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      token: result.token,
    })
  } catch (error: any) {
    // Duplicate email
    if (error.message && error.message.includes("unique constraint")) {
      return res.status(409).json({ message: "Email already exists" })
    }
    res.status(500).json({ message: "Internal Server Error" })
  }
})

authRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" })
    }

    if (!password || password.trim().length === 0) {
      return res.status(400).json({ message: "Password is required" })
    }

    // Normalize email for lookup
    const normalizedEmail = email.toLowerCase().trim()

    const result = await AuthService.login(normalizedEmail, password)

    if (!result) {
      // Generic message to prevent account enumeration
      return res.status(401).json({ message: "Invalid email or password" })
    }

    res.json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      token: result.token,
    })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

authRoutes.get("/profile", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }
    const user = await AuthService.validateToken(token)
    if (!user) {
      return res.status(401).json({ message: "Invalid token" })
    }
    res.json({ user })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

authRoutes.post("/assign-role", async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body

    // Validate role value
    const validRoles = ["CUSTOMER", "ADMIN", "DEVELOPER"] as const
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role value" })
    }

    // Verify authenticated user first
    const token = req.headers.authorization?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }
    const authenticatedUser = await AuthService.validateToken(token)
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Invalid token" })
    }

    // Only ADMIN role can assign roles
    if (authenticatedUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can assign roles" })
    }

    const user = await AuthService.assignRole(userId, role)
    res.json({ user })
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

export default authRoutes