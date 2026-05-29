/**
 * Prisma Client 单例
 * 在开发模式下复用同一个实例，避免热重载时连接数爆炸
 */
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const filename = url.startsWith("file:")
    ? path.resolve(process.cwd(), url.slice("file:".length))
    : url;

  const adapter = new PrismaBetterSqlite3({ url: `file:${filename}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
