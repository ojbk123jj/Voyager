# syntax=docker/dockerfile:1.7
# ============================================================================
# Voyager — 多阶段 Dockerfile
#   base        共享：Node + pnpm 预激活 + 国内 npm 源
#   deps        装全部依赖（含 dev），用于 build
#   builder     生成 Prisma 客户端 + Next.js standalone 构建
#   prod-deps   独立装一份生产依赖（用于 runner，扁平 node_modules）
#   runner      极简运行镜像，只含 standalone + prod 依赖
#
# 关于网络：国内构建 Docker 镜像时，corepack 默认会去 registry.npmjs.org
# 拉取 pnpm 最新版导致超时；这里用 COREPACK_DEFAULT_TO_LATEST=0 + 预先 prepare
# 配合淘宝镜像，构建过程不再依赖 npm 官方源。
# ============================================================================

ARG NODE_VERSION=22.22.3
ARG PNPM_VERSION=11.4.0
ARG NPM_REGISTRY=https://registry.npmmirror.com

# ----------------------------------------------------------------------------
# Stage 0: base（所有后续阶段都 FROM 这个）
# ----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS base
ARG PNPM_REGISTRY=https://registry.npmmirror.com
ARG PNPM_VERSION
WORKDIR /app

# 配置 npm/pnpm 用国内镜像，并把 prebuild-install 的二进制也指过去
ENV COREPACK_DEFAULT_TO_LATEST=0 \
    COREPACK_NPM_REGISTRY=${PNPM_REGISTRY} \
    NPM_CONFIG_REGISTRY=${PNPM_REGISTRY} \
    PNPM_REGISTRY=${PNPM_REGISTRY} \
    npm_config_registry=${PNPM_REGISTRY} \
    npm_config_better_sqlite3_binary_host_mirror=https://npmmirror.com/mirrors/better-sqlite3 \
    npm_config_sharp_binary_host=https://npmmirror.com/mirrors/sharp \
    npm_config_sharp_libvips_binary_host=https://npmmirror.com/mirrors/sharp-libvips

# 提前激活并准备好 pnpm 指定版本（避开 corepack 运行时去 npm 查最新版）
RUN corepack enable && \
    corepack prepare pnpm@${PNPM_VERSION} --activate

# ----------------------------------------------------------------------------
# Stage 1: 装全部依赖（用于 build）
# ----------------------------------------------------------------------------
FROM base AS deps

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      python3 make g++ openssl ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ----------------------------------------------------------------------------
# Stage 2: 构建
# ----------------------------------------------------------------------------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm exec prisma generate

# 用临时空 SQLite 让 build 时 SSG 查询拿到合法 schema（无数据）
ENV DATABASE_URL=file:/tmp/build.db
RUN pnpm exec prisma migrate deploy

RUN pnpm run build

# ----------------------------------------------------------------------------
# Stage 3: 仅生产依赖
# ----------------------------------------------------------------------------
FROM base AS prod-deps

# 装编译工具（better-sqlite3 install 时 node-gyp 兜底要用）
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      python3 make g++ openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# node-linker=hoisted 让 pnpm 生成扁平 node_modules（无符号链接）
# 否则 docker COPY 会把每个 .pnpm symlink 解引用，体积翻倍以上
ENV NPM_CONFIG_NODE_LINKER=hoisted
RUN pnpm install --frozen-lockfile --prod && \
    apt-get purge -y --auto-remove python3 make g++ && \
    rm -rf /var/lib/apt/lists/* /tmp/* /root/.cache /root/.npm /root/.local

# ----------------------------------------------------------------------------
# Stage 4: 运行
# ----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs --shell /bin/false nextjs

# Next.js standalone 输出（自带 server.js）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 用 prod-deps 阶段产出的完整依赖树替换 standalone 自带的那份
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# 迁移所需：schema + 配置 + 生成的客户端
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

# 入口脚本
COPY --chown=nextjs:nodejs scripts/docker-entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# 数据库目录（docker-compose 挂 volume）
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
