"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = __importDefault(require("@prisma/client"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.default();
class AuthService {
    static async register(name, email, password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: "CUSTOMER",
            },
        });
        const authUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.NEXTAUTH_SECRET || "default-secret", { expiresIn: "7d" });
        return { user: authUser, token };
    }
    static async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            return null;
        const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValid)
            return null;
        const authUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.NEXTAUTH_SECRET || "default-secret", { expiresIn: "7d" });
        return { user: authUser, token };
    }
    static async validateToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.NEXTAUTH_SECRET || "default-secret");
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
            });
            if (!user)
                return null;
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            };
        }
        catch {
            return null;
        }
    }
    static async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                orders: { take: 5, orderBy: { createdAt: "desc" } },
                projects: { take: 5, orderBy: { createdAt: "desc" } },
            },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
    static async assignRole(userId, role) {
        return prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map