"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const client_1 = __importDefault(require("@prisma/client"));
const prisma = new client_1.default();
exports.categoryRoutes = require("express").Router();
exports.categoryRoutes.get("/", async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: {
                    take: 3,
                    where: { status: "ACTIVE" },
                },
            },
            orderBy: { name: "asc" },
        });
        return res.json(categories);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = exports.categoryRoutes;
//# sourceMappingURL=category.routes.js.map