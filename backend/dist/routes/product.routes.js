"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.productRoutes = require("express").Router();
// GET /api/products - List products with search, filter, sort, pagination
exports.productRoutes.get("/", async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12, sort = "latest" } = req.query;
        const where = {};
        // Category filter
        if (category) {
            where.category = { slug: String(category) };
        }
        // Search filter
        if (search) {
            where.OR = [
                { name: { contains: String(search), mode: "insensitive" } },
                { shortDescription: { contains: String(search), mode: "insensitive" } },
                { fullDescription: { contains: String(search), mode: "insensitive" } },
            ];
        }
        // Status filter
        if (status) {
            where.status = status;
        }
        const skip = (Number(page) - 1) * Number(limit);
        const orderBy = {};
        if (sort === "price-low") {
            orderBy.price = "asc";
        }
        else if (sort === "price-high") {
            orderBy.price = "desc";
        }
        else if (sort === "name-a") {
            orderBy.name = "asc";
        }
        else if (sort === "name-z") {
            orderBy.name = "desc";
        }
        else {
            // default: latest
            orderBy.createdAt = "desc";
        }
        const [products, total] = await Promise.all([
            prisma_1.default.product.findMany({
                where,
                include: { category: true, images: true, features: true },
                orderBy,
                skip,
                take: Number(limit),
            }),
            prisma_1.default.product.count({ where }),
        ]);
        const totalPages = Math.ceil(total / Number(limit));
        res.json({ products, total, page: Number(page), totalPages });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// GET /api/products/:slug - Get single product by slug
exports.productRoutes.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { slug },
            include: { category: true, images: true, features: true },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// POST /api/products - Create a new product
exports.productRoutes.post("/", async (req, res) => {
    try {
        const body = req.body;
        const product = await prisma_1.default.product.create({
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
        res.status(201).json(product);
    }
    catch (error) {
        // Duplicate slug
        if (error.message && error.message.includes("unique constraint")) {
            return res.status(409).json({ message: "A product with this slug already exists" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// GET /api/products/featured - Get featured products
exports.productRoutes.get("/featured", async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            where: { featured: true, status: "ACTIVE" },
            include: { category: true, images: true },
            take: 8,
            orderBy: { createdAt: "desc" },
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = exports.productRoutes;
//# sourceMappingURL=product.routes.js.map