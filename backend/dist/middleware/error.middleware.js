"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || "Internal Server Error" });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map