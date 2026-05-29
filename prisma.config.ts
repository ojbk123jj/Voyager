import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// 把 DATABASE_URL=file:./dev.db 解析成绝对路径
const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const filename = url.startsWith("file:")
  ? path.resolve(process.cwd(), url.slice("file:".length))
  : url;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  adapter: () => new PrismaBetterSqlite3({ url: `file:${filename}` }),
});
