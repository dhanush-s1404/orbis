const isDevelopment = process.env.NODE_ENV !== "production"

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500

  if (isDevelopment) {
    // Development: log full error for debugging, send minimal safe message
    console.error("ERROR:", {
      message: err.message,
      stack: err.stack,
      path: req?.route?.path || req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    })
    res.status(statusCode).json({ message: err.message || "Internal Server Error" })
  } else {
    // Production: never expose internal details
    console.error("ERROR:", {
      message: err.message || "Internal Server Error",
      timestamp: new Date().toISOString(),
    })
    res.status(statusCode).json({ message: "Internal Server Error" })
  }
}