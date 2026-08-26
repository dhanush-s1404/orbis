"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = void 0;
exports.handleAIGenerate = handleAIGenerate;
exports.handleAIRewrite = handleAIRewrite;
exports.handleAIHistory = handleAIHistory;
exports.handleAIStatus = handleAIStatus;
const client_1 = require("../generated/client");
const ai_service_1 = require("../services/ai.service");
const prisma = new client_1.PrismaClient();
// AI credit costs (from configuration)
const AI_COSTS = {
    fullGeneration: 5, // AI_COST_FULL_GENERATION
    sectionRewrite: 2, // AI_COST_SECTION_REWRITE
    variation: 1, // AI_COST_VARIATION
    rewrite: 1, // AI_COST_REWRITE
};
// POST /api/ai/generate - Generate AI website content
// Requires authentication, validated business profile, template sections
async function handleAIGenerate(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { profile, templateSections } = req.body;
        if (!profile || !templateSections || templateSections.length === 0) {
            return res.status(400).json({ message: "Business profile and template sections are required" });
        }
        // Validate profile fields
        const validationErrors = [];
        if (profile.businessName?.trim().length === 0) {
            validationErrors.push("Business name is required");
        }
        if (profile.description?.trim().length < 10) {
            validationErrors.push("Description must be at least 10 characters");
        }
        if (profile.description?.trim().length > 500) {
            validationErrors.push("Description must be less than 500 characters");
        }
        if (profile.services?.length === 0) {
            validationErrors.push("At least one service must be specified");
        }
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: "Validation failed", errors: validationErrors });
        }
        // Template-aware generation: limit sections based on template
        // In production, fetch template definition and filter sections
        const allowedSections = templateSections.filter((s) => s === "hero" || s === "features" || s === "about" ||
            s === "services" || s === "cta" || s === "footer" ||
            s === "testimonials" || s === "pricing" || s === "contact");
        // Check user's AI credits before generation
        const user = (await prisma.user.findUnique({
            where: { id: userId },
        }));
        if (!user || (user.credits ?? 0) < AI_COSTS.fullGeneration) {
            return res.status(400).json({
                message: "Insufficient AI credits. You need " + AI_COSTS.fullGeneration + " credits for full generation.",
                currentCredits: user?.credits ?? 0
            });
        }
        // Generate content using configured provider
        const response = await ai_service_1.AIService.generateWebsiteContent(profile, allowedSections);
        if (!response.success) {
            return res.status(500).json({ message: "AI generation failed", errors: response.errors });
        }
        // Deduct credits after successful AI generation
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: AI_COSTS.fullGeneration } },
        });
        // Persist AI usage record with the user's project
        const userProject = (await prisma.project.findFirst({
            where: { userId },
        }));
        await prisma.aIUsage.create({
            data: {
                ...(userProject ? { project: { connect: { id: userProject.id } } } : { projectId: userId }),
                businessName: profile.businessName,
                industry: profile.industry,
                targetAudience: profile.targetAudience,
                goal: profile.goal,
                tone: profile.tone,
                services: profile.services,
                generationCount: 1,
                creditsConsumed: AI_COSTS.fullGeneration,
            },
        });
        res.json({
            success: true,
            profile: response.profile,
            sections: response.sections,
            styleSuggestions: response.styleSuggestions,
            metadata: response.metadata,
        });
    }
    catch (error) {
        console.error("AI generation error:", error);
        res.status(500).json({ message: "Internal Server Error", errors: [error.message] });
    }
}
// POST /api/ai/rewrite - Rewrite existing content with AI
// Requires authentication, existing content, and instruction
async function handleAIRewrite(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { existingContent, instruction } = req.body;
        if (!existingContent || !instruction) {
            return res.status(400).json({ message: "Existing content and instruction are required" });
        }
        if (existingContent.trim().length === 0) {
            return res.status(400).json({ message: "Existing content cannot be empty" });
        }
        if (instruction.trim().length === 0) {
            return res.status(400).json({ message: "Instruction cannot be empty" });
        }
        // Limit instruction length
        if (instruction.trim().length > 200) {
            return res.status(400).json({ message: "Instruction must be less than 200 characters" });
        }
        const result = await ai_service_1.AIService.rewriteContent(existingContent, instruction);
        if (!result.success) {
            return res.status(500).json({ message: "AI rewrite failed", error: result.error });
        }
        // Deduct credits after successful AI rewrite
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: AI_COSTS.rewrite } },
        });
        res.json({
            success: true,
            content: result.content,
        });
    }
    catch (error) {
        console.error("AI rewrite error:", error);
        res.status(500).json({ message: "Internal Server Error", errors: [error.message] });
    }
}
// GET /api/ai/history - Get AI generation history for user projects
async function handleAIHistory(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const history = await prisma.aIUsage.findMany({
            where: { project: { userId } },
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
                id: true,
                businessName: true,
                industry: true,
                goal: true,
                tone: true,
                generationCount: true,
                createdAt: true,
            },
        });
        res.json({ history });
    }
    catch (error) {
        console.error("AI history error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// GET /api/ai/status - Check AI provider status
async function handleAIStatus(req, res) {
    const provider = ai_service_1.AIService.getProvider();
    if (!provider) {
        return res.json({
            providerConfigured: false,
            status: "no_provider",
            message: "AI provider not configured. Contact administrator to enable AI features.",
        });
    }
    return res.json({
        providerConfigured: true,
        status: "ready",
        message: "AI provider is configured and ready.",
    });
}
exports.aiRoutes = require("express").Router();
exports.aiRoutes.post("/generate", async (req, res) => {
    try {
        await handleAIGenerate(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.aiRoutes.post("/rewrite", async (req, res) => {
    try {
        await handleAIRewrite(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.aiRoutes.get("/history", async (req, res) => {
    try {
        await handleAIHistory(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.aiRoutes.get("/status", async (req, res) => {
    try {
        await handleAIStatus(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
//# sourceMappingURL=ai.routes.js.map