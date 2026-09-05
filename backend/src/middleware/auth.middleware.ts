import { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/auth.service"

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const user = await AuthService.validateToken(token)

    if (!user) {
      return res.status(401).json({ message: "Invalid token" })
    }

    ;(req as any).user = user
    next()
  } catch (error) {
    console.error("Authentication middleware error:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")

    if (token) {
      const user = await AuthService.validateToken(token)
      if (user) {
        ;(req as any).user = user
      }
    }
    next()
  } catch (error) {
    next() // Continue without auth if token is invalid
  }
}