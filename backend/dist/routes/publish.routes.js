"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publishing_service_1 = require("../services/publishing.service");
const publishRoutes = require("express").Router();
// GET /api/publish/:slug - Get published website data by slug
publishRoutes.get("/:slug", async (req, res) => {
    try {
        await (0, publishing_service_1.handlePublicRoute)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// GET /p/:slug - Public route for published website (Next.js client-side)
// This is handled on the frontend, but we also provide an API fallback
publishRoutes.get("/:slug", async (req, res) => {
    // This endpoint is primarily for API usage
    // The frontend Next.js page /published/[slug] will handle client-side rendering
    await (0, publishing_service_1.handlePublicRoute)(req, res);
});
exports.default = publishRoutes;
//# sourceMappingURL=publish.routes.js.map