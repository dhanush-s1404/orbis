"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const client_1 = __importDefault(require("@prisma/client"));
const prisma = new client_1.default();
exports.orderRoutes = require("express").Router();
exports.orderRoutes.get("/", async (req, res) => {
    try {
        const userId = req.user?.id;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { orderItems: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });
        return res.json(orders);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.orderRoutes.post("/", async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod } = req.body;
        const userId = req.user?.id;
        const order = await prisma.order.create({
            data: {
                userId,
                status: "PENDING",
                paymentStatus: "UNPAID",
                totalAmount,
                paymentMethod,
                orderItems: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { orderItems: { include: { product: true } } },
        });
        return res.status(201).json(order);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = exports.orderRoutes;
//# sourceMappingURL=order.routes.js.map