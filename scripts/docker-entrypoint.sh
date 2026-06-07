#!/bin/sh
# =============================================================================
# Voyager 容器启动入口
# 1) 校验 DATABASE_URL 必须存在
# 2) 应用 Prisma 迁移（首次启动会建表，之后是 no-op）
# 3) 启动 Next.js standalone server
# =============================================================================
set -e

if [ -z "${DATABASE_URL}" ]; then
  echo "[entrypoint] FATAL: DATABASE_URL is not set" >&2
  exit 1
fi

echo "[entrypoint] DATABASE_URL=${DATABASE_URL}"
echo "[entrypoint] Applying database migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "[entrypoint] Starting Next.js server on port ${PORT:-3000}..."
exec node server.js
