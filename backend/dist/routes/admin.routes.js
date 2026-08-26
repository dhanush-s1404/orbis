"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const client_1 = require("../generated/client");
const prisma = new client_1.PrismaClient();
exports.adminRoutes = require("express").Router();
exports.adminRoutes.get("/", async (req, res) => {
    try {
        const [users, products, orders, projects, notifications] = await Promise.all([
            prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true } }),
            prisma.product.count(),
            prisma.order.count(),
            prisma.project.count(),
            prisma.notification.findMany({ where: { read: false }, take: 10, orderBy: { createdAt: "desc" } }),
        ]);
        const totalUsers = users.length;
        const adminCount = users.filter((u) => u.role === "ADMIN").length;
        const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
        const developerCount = users.filter((u) => u.role === "DEVELOPER").length;
        const recentOrders = await prisma.order.findMany({
            include: { user: true, orderItems: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
            take: 5,
        });
        const recentProjects = await prisma.project.findMany({
            include: { user: true },
            orderBy: { createdAt: "desc" },
            take: 5,
        });
        return res.json({
            stats: {
                totalUsers,
                adminCount,
                customerCount,
                developerCount,
                totalProducts: products,
                totalOrders: orders,
                totalProjects: projects,
            },
            recentOrders,
            recentProjects,
            unreadNotifications: notifications.length,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch admin data",
            error: error.message,
        });
    }
});
exports.default = exports.adminRoutes;
//# sourceMappingURL=admin.routes.js.map