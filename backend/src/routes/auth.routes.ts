import { Request, Response } from "express"
import { AuthService } from "../services/auth.service"

export const authRoutes = require("express").Router()

authRoutes.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const result = await AuthService.register(name, email, password)
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
    res.status(500).json({ message: error.message })
  }
})

authRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await AuthService.login(email, password)
    if (!result) {
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
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
})

authRoutes.post("/assign-role", async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body
    const user = await AuthService.assignRole(userId, role)
    res.json({ user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default authRoutes