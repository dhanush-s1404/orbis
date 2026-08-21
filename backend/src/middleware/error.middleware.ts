export const errorHandler = (err: any, req: any, res: Response, next: any) => {
  console.error("Error:", err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({ message: err.message || "Internal Server Error" })
}