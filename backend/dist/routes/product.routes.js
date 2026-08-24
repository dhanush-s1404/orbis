"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const client_1 = __importDefault(require("@prisma/client"));
const prisma = new client_1.default();
exports.productRoutes = require("express").Router();
exports.productRoutes.get("/", async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12, sort = "latest" } = req.query;
        const where = {};
        if (category) {
            where.category = { slug: String(category) };
        }
        if (search) {
            where.OR = [
                { name: { contains: String(search), mode: "insensitive" } },
                { shortDescription: { contains: String(search), mode: "insensitive" } },
                { fullDescription: { contains: String(search), mode: "insensitive" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: true, images: true, features: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: Number(limit),
            }),
            prisma.product.count({ where }),
        ]);
        const totalPages = Math.ceil(total / Number(limit));
        return res.json({ products, total, page: Number(page), totalPages });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.productRoutes.post("/", async (req, res) => {
    try {
        const body = req.body;
        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                shortDescription: body.shortDescription,
                fullDescription: body.fullDescription,
                price: body.price,
                discountPrice: body.discountPrice,
                categoryId: body.categoryId,
                demoUrl: body.demoUrl,
                status: body.status || "ACTIVE",
                featured: body.featured || false,
                license: body.license || "standard",
            },
        });
        return res.status(201).json(product);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = exports.productRoutes;
//# sourceMappingURL=product.routes.js.map