import "dotenv/config";
import { defineConfig } from "prisma/config";

// CLI（migrate / studio / db pull）通过 datasource.url 连接数据库。
// 运行时的 PrismaClient 则用 driver adapter（见 src/lib/prisma.ts），二者分工不同。
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
