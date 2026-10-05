import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] });

// Reuse one client across hot reloads (dev) and warm invocations (Vercel)
globalForPrisma.prisma = prisma;
