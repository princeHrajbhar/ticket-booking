"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// lib/prisma.ts
require("dotenv/config");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const client_1 = require("@prisma/client"); // ✅ FIXED
const adapter = new adapter_mariadb_1.PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT) || 4000,
    connectionLimit: 5,
    ssl: { minVersion: "TLSv1.2" },
});
const prisma = new client_1.PrismaClient({
    adapter,
});
exports.prisma = prisma;
