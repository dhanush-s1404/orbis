"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.categoryRoutes = require("express").Router();
// GET /api/categories - List all categories with product counts
exports.categoryRoutes.get("/", async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            include: {
                products: {
                    where: { status: "ACTIVE" },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        discountPrice: true,
                        slug: true,
                        featured: true,
                    },
                    take: 6,
                },
            },
            orderBy: { name: "asc" },
        });
        // Transform to include product count
        const transformed = categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            productCount: category.products.length,
            featuredProducts: category.products
                .filter((p) => p.featured)
                .map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                discountPrice: p.discountPrice,
                slug: p.slug,
            })),
        }));
        res.json(transformed);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// GET /api/categories/:slug - List products in a specific category
exports.categoryRoutes.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 12, sort = "latest" } = req.query;
        const where = {
            category: { slug },
            status: "ACTIVE",
        };
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            prisma_1.default.product.findMany({
                where,
                include: { category: true, images: true, features: true },
                orderBy: sort === "latest" ? { createdAt: "desc" } : sort === "price-low" ? { price: "asc" } : sort === "price-high" ? { price: "desc" } : { createdAt: "desc" },
                skip,
                take: Number(limit),
            }),
            prisma_1.default.product.count({ where }),
        ]);
        const totalPages = Math.ceil(total / Number(limit));
        res.json({ products, total, page: Number(page), totalPages, categorySlug: slug });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = exports.categoryRoutes;
//# sourceMappingURL=category.routes.js.map