const isDevelopment = process.env.NODE_ENV !== "production"

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error("Error:", err)
  const statusCode = err.statusCode || 500
  const message = isDevelopment ? (err.message || "Internal Server Error") : "Internal Server Error"
  res.status(statusCode).json({ message })
}