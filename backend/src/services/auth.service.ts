import { PrismaClient } from "../generated/client"
import { User } from "../generated/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export interface AuthUser {
  id: string
  name: string | null
  email: string
  role: "CUSTOMER" | "ADMIN" | "DEVELOPER"
}

export class AuthService {
  static async register(name: string, email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "CUSTOMER",
      },
    })

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.NEXTAUTH_SECRET || "default-secret",
      { expiresIn: "7d" }
    )

    return { user: authUser, token }
  }

  static async login(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) return null

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.NEXTAUTH_SECRET || "default-secret",
      { expiresIn: "7d" }
    )

    return { user: authUser, token }
  }

  static async validateToken(token: string): Promise<AuthUser | null> {
    try {
      const payload = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || "default-secret"
      ) as { userId: string; role: string }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      })

      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    } catch {
      return null
    }
  }

  static async getProfile(userId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: { take: 5, orderBy: { createdAt: "desc" } },
        projects: { take: 5, orderBy: { createdAt: "desc" } },
      },
    })

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }

  static async assignRole(userId: string, role: "CUSTOMER" | "ADMIN" | "DEVELOPER"): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    })
  }
}

export default AuthService