/**
 * Prisma Client 单例
 * 在开发模式下复用同一个实例，避免热重载时连接数爆炸
 */
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma() {
  // 适配器内部会自行去掉 file: 前缀，并把相对路径解析到 process.cwd()，
  // 所以这里直接透传 DATABASE_URL 即可，无需手动 path.resolve。
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
