"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const client_1 = __importDefault(require("@prisma/client"));
const prisma = new client_1.default();
exports.projectRoutes = require("express").Router();
exports.projectRoutes.get("/", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projects = await prisma.customProject.findMany({
            where: { userId },
            include: {
                projectMessages: true,
                projectFiles: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json(projects);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.projectRoutes.post("/", async (req, res) => {
    try {
        const { name, email, phone, businessName, websiteType, industry, businessDescription, targetAudience, requiredPages, requiredFeatures, designPreferences, referenceWebsites, existingWebsite, budget, timeline, additionalRequirements } = req.body;
        const userId = req.user?.id;
        const project = await prisma.customProject.create({
            data: {
                status: "SUBMITTED",
                name,
                email,
                phone,
                businessName,
                websiteType,
                industry,
                businessDescription,
                targetAudience,
                requiredPages,
                requiredFeatures,
                designPreferences,
                referenceWebsites,
                existingWebsite,
                budget,
                timeline,
                additionalRequirements,
                user: { connect: { id: userId } },
            },
            include: {
                projectMessages: true,
                projectFiles: true,
            },
        });
        return res.status(201).json(project);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.default = exports.projectRoutes;
//# sourceMappingURL=project.routes.js.map