"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
// Configure the PostgreSQL driver adapter
// This is required for Prisma 7.x with PostgreSQL
// The DATABASE_URL is loaded from environment variables
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map