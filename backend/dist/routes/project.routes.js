"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
exports.verifyProjectOwnership = verifyProjectOwnership;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Helper: validate project ownership
async function verifyProjectOwnership(projectId, userId) {
    const project = await prisma.Project.findUnique({
        where: { id: projectId },
        include: { user: true },
    });
    if (!project) {
        return { project: null, owned: false };
    }
    const owned = project.userId === userId;
    return { project, owned };
}
exports.projectRoutes = require("express").Router();
// GET /api/projects - List projects for authenticated user
exports.projectRoutes.get("/", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const projects = await prisma.Project.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// POST /api/projects - Create a new project
exports.projectRoutes.post("/", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, description, status, budget, timeline } = req.body;
        // Validate required fields
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Project name is required" });
        }
        // Create project with authenticated user ownership
        const project = await prisma.Project.create({
            data: {
                name: name.trim(),
                description: description?.trim(),
                status: status || "SUBMITTED",
                budget: budget ?? undefined,
                timeline: timeline || undefined,
                user: { connect: { id: userId } },
            },
        });
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// GET /api/projects/:id - Get project details
exports.projectRoutes.get("/:id", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify ownership first
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// PATCH /api/projects/:id - Update project
exports.projectRoutes.patch("/:id", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify ownership first
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        // Only allow specific fields to be updated
        const { name, description, status, budget, timeline } = req.body;
        const updateData = {};
        if (name !== undefined && name.trim().length > 0) {
            updateData.name = name.trim();
        }
        if (description !== undefined) {
            updateData.description = description?.trim() || undefined;
        }
        if (status !== undefined) {
            updateData.status = status;
        }
        if (budget !== undefined) {
            updateData.budget = budget;
        }
        if (timeline !== undefined) {
            updateData.timeline = timeline;
        }
        const updatedProject = await prisma.Project.update({
            where: { id: projectId },
            data: updateData,
        });
        res.json(updatedProject);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// DELETE /api/projects/:id - Delete/Archive project
exports.projectRoutes.delete("/:id", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify ownership first
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        // Soft delete: set status to ARCHIVED instead of permanent delete
        const updatedProject = await prisma.Project.update({
            where: { id: projectId },
            data: { status: "ARCHIVED" },
        });
        res.json({ message: "Project archived successfully", project: updatedProject });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// POST /api/projects/:id/publish - Publish a project
exports.projectRoutes.post("/:id/publish", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify ownership first
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        // Validate project has builder state and template
        if (!project.builderState) {
            return res.status(400).json({ message: "Project has no builder state. Cannot publish." });
        }
        const builderState = JSON.parse(project.builderState);
        if (!builderState.templateId) {
            return res.status(400).json({ message: "Project has no template. Cannot publish." });
        }
        // Validate builder state has required data
        const { templateId, pages, styles } = builderState;
        if (!pages || pages.length === 0) {
            return res.status(400).json({ message: "Project has no pages. Cannot publish." });
        }
        // Generate a slug from project name or use timestamp-based slug
        const slug = `project-${projectId}-${Date.now()}`.replace(/[^a-z0-9]/gi, "-").toLowerCase();
        // Update project with publishing info
        const updatedProject = await prisma.Project.update({
            where: { id: projectId },
            data: {
                publishStatus: "PUBLISHED",
                publishedAt: new Date(),
                publishedSlug: slug,
                publishedCount: { increment: 1 },
            },
        });
        res.json({
            project: updatedProject,
            publicUrl: `/p/${slug}`,
            message: "Project published successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// POST /api/projects/:id/unpublish - Unpublish a project
exports.projectRoutes.post("/:id/unpublish", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify ownership first
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        // Update project to unpublish
        const updatedProject = await prisma.Project.update({
            where: { id: projectId },
            data: {
                publishStatus: "UNPUBLISHED",
                publishedAt: null,
                publishedSlug: null,
            },
        });
        res.json({
            project: updatedProject,
            message: "Project unpublished successfully. Project and builder data preserved.",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// GET /api/projects/:id/publish-status - Get publish status
exports.projectRoutes.get("/:id/publish-status", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify ownership first
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        res.json({
            publishStatus: project.publishStatus,
            publishedAt: project.publishedAt,
            publishedSlug: project.publishedSlug,
            publishedCount: project.publishedCount,
            hasBuilderState: !!project.builderState,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = exports.projectRoutes;
//# sourceMappingURL=project.routes.js.map