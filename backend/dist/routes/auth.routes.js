"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const auth_service_1 = require("../services/auth.service");
exports.authRoutes = require("express").Router();
exports.authRoutes.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await auth_service_1.AuthService.register(name, email, password);
        res.status(201).json({
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
            },
            token: result.token,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.authRoutes.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await auth_service_1.AuthService.login(email, password);
        if (!result) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.json({
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
            },
            token: result.token,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.authRoutes.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const user = await auth_service_1.AuthService.validateToken(token);
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.authRoutes.post("/assign-role", async (req, res) => {
    try {
        const { userId, role } = req.body;
        const user = await auth_service_1.AuthService.assignRole(userId, role);
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = exports.authRoutes;
//# sourceMappingURL=auth.routes.js.map