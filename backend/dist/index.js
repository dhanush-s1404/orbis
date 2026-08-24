"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const client_1 = __importDefault(require("@prisma/client"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const prisma = new client_1.default();
exports.prisma = prisma;
const app = (0, express_1.default)();
exports.app = app;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express_1.default.json({ limit: "10mb" }));
const rateLimit = (req, res, next) => {
    const now = Date.now();
    const { ip } = req;
    // Simple in-memory rate limit
    const cache = rateLimit.cache || {};
    const ipKey = ip || "unknown";
    const lastReq = cache[ipKey] || 0;
    if (now - lastReq < 1000) {
        const count = (cache[ipKey + "_count"] || 1) + 1;
        cache[ipKey + "_count"] = count;
        if (count > 10)
            return res.status(429).json({ message: "Too many requests" });
    }
    else {
        cache[ipKey] = now;
        cache[ipKey + "_count"] = 1;
    }
    ;
    rateLimit.cache = cache;
    next();
};
app.use(rateLimit);
// Routes
app.use("/api/products", product_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/projects", project_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Error handler
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`📅 Database: ${process.env.DATABASE_URL?.split("@")[1] || "localhost"}`);
});
//# sourceMappingURL=index.js.map