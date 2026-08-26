"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const isDevelopment = process.env.NODE_ENV !== "production";
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    const message = isDevelopment ? (err.message || "Internal Server Error") : "Internal Server Error";
    res.status(statusCode).json({ message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map