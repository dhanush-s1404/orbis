import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient({
  // Configure the PostgreSQL driver adapter
  // This is required for Prisma 7.x with PostgreSQL
  // The DATABASE_URL is loaded from environment variables
})

export default prisma