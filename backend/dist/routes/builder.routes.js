"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builderRoutes = void 0;
exports.verifyProjectOwnership = verifyProjectOwnership;
const client_1 = require("../generated/client");
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
// POST /api/builder/create - Create a new builder project from a template
exports.builderRoutes.post("/create", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { templateId, name, templateConfig } = req.body;
        if (!templateId) {
            return res.status(400).json({ message: "Template ID is required" });
        }
        // Validate template exists
        const template = await prisma.Template.findUnique({
            where: { id: templateId, isActive: true },
        });
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        // Create project associated with template
        const project = await prisma.Project.create({
            data: {
                name: name || `Website Project ${new Date().getFullYear()}`,
                description: "Website built using ORBIS Builder",
                status: "SUBMITTED",
                user: { connect: { id: userId } },
                templateId,
                builderState: JSON.stringify({
                    templateId,
                    pages: template.pages || [],
                    sections: template.sections || [],
                    content: template.defaultContent || {},
                    styles: template.defaultStyles || {},
                }),
            },
        });
        res.status(201).json({
            project,
            message: "Builder project created successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// GET /api/builder/:id - Load builder state for a project
exports.builderRoutes.get("/:id", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify ownership
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        // Return builder state
        res.json({
            project: {
                id: project.id,
                name: project.name,
                templateId: project.templateId,
                builderState: project.builderState,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// PATCH /api/builder/:id - Save builder state
exports.builderRoutes.patch("/:id", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        const { builderState } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!builderState) {
            return res.status(400).json({ message: "Builder state is required" });
        }
        // Verify ownership
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        // Update builder state
        const updatedProject = await prisma.Project.update({
            where: { id: projectId },
            data: { builderState },
        });
        res.json({
            project: {
                id: updatedProject.id,
                name: updatedProject.name,
                builderState: updatedProject.builderState,
            },
            message: "Builder state saved successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// GET /api/builder/templates - Get available templates
exports.builderRoutes.get("/templates", async (req, res) => {
    try {
        const templates = await prisma.Template.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
        });
        res.json(templates);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// POST /api/builder/pages - Manage pages
exports.builderRoutes.post("/:id/pages", async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;
        const { action, pageData } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify ownership
        const { project, owned } = await verifyProjectOwnership(projectId, userId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!owned) {
            return res.status(403).json({ message: "Access denied: You do not own this project" });
        }
        let updatedProject;
        switch (action) {
            case "add":
                // Add a new page to the builder state
                const currentState = project.builderState
                    ? JSON.parse(project.builderState)
                    : { pages: [], sections: {} };
                const newPage = {
                    id: `page-${Date.now()}`,
                    name: pageData?.name || "New Page",
                    sections: pageData?.sections || [],
                    content: pageData?.content || {},
                    styles: pageData?.styles || {},
                };
                currentState.pages.push(newPage);
                updatedProject = await prisma.Project.update({
                    where: { id: projectId },
                    data: { builderState: JSON.stringify(currentState) },
                });
                break;
            case "update":
                // Update an existing page
                const state = JSON.parse(project.builderState || "{}");
                const pageIndex = state.pages.findIndex((p) => p.id === pageData?.id);
                if (pageIndex >= 0) {
                    state.pages[pageIndex] = {
                        ...state.pages[pageIndex],
                        name: pageData?.name,
                        sections: pageData?.sections,
                        content: pageData?.content,
                        styles: pageData?.styles,
                    };
                }
                updatedProject = await prisma.Project.update({
                    where: { id: projectId },
                    data: { builderState: JSON.stringify(state) },
                });
                break;
            case "delete":
                // Delete a page
                const stateDelete = JSON.parse(project.builderState || "{}");
                stateDelete.pages = stateDelete.pages.filter((p) => p.id !== pageData?.id);
                updatedProject = await prisma.Project.update({
                    where: { id: projectId },
                    data: { builderState: JSON.stringify(stateDelete) },
                });
                break;
            default:
                return res.status(400).json({ message: "Invalid action" });
        }
        res.json({
            project: {
                id: updatedProject.id,
                name: updatedProject.name,
                builderState: updatedProject.builderState,
            },
            message: "Page updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.builderRoutes = require("express").Router();
//# sourceMappingURL=builder.routes.js.map