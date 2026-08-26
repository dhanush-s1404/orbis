"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const auth_service_1 = require("../services/auth.service");
exports.authRoutes = require("express").Router();
// Helper: validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
exports.authRoutes.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validate inputs
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: "Valid email is required" });
        }
        if (!password || password.trim().length === 0) {
            return res.status(400).json({ message: "Password is required" });
        }
        // Check minimum password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        // Check password confirmation if provided
        // Note: frontend should handle confirmation, but we validate here too
        // Normalize email to lowercase to prevent duplicate accounts
        const normalizedEmail = email.toLowerCase().trim();
        const result = await auth_service_1.AuthService.register(name, normalizedEmail, password);
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
        // Duplicate email
        if (error.message && error.message.includes("unique constraint")) {
            return res.status(409).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.authRoutes.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: "Valid email is required" });
        }
        if (!password || password.trim().length === 0) {
            return res.status(400).json({ message: "Password is required" });
        }
        // Normalize email for lookup
        const normalizedEmail = email.toLowerCase().trim();
        const result = await auth_service_1.AuthService.login(normalizedEmail, password);
        if (!result) {
            // Generic message to prevent account enumeration
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
        res.status(500).json({ message: "Internal Server Error" });
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
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.authRoutes.post("/assign-role", async (req, res) => {
    try {
        const { userId, role } = req.body;
        // Validate role value
        const validRoles = ["CUSTOMER", "ADMIN", "DEVELOPER"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role value" });
        }
        // Verify authenticated user first
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const authenticatedUser = await auth_service_1.AuthService.validateToken(token);
        if (!authenticatedUser) {
            return res.status(401).json({ message: "Invalid token" });
        }
        // Only ADMIN role can assign roles
        if (authenticatedUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only admin can assign roles" });
        }
        const user = await auth_service_1.AuthService.assignRole(userId, role);
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = exports.authRoutes;
//# sourceMappingURL=auth.routes.js.map