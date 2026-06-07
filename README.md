# Voyager — Travel Journal

一个杂志风的个人旅行日志应用。记录去过的地方、评分、心情、标签，支持搜索/筛选/排序、收藏、地图分区视图。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16（App Router + React Server Components） |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| ORM | Prisma 7（driver adapter 模式） |
| 数据库 | SQLite（本地）/ 可平滑切换 PostgreSQL |
| 校验 | Zod |
| 字体 | Cormorant Garamond + Karla（next/font 自托管） |

## 本地开发

前置：Node.js ≥ 18.18、pnpm。

```bash
# 安装依赖
pnpm install

# 初始化数据库 + 灌入示例数据
pnpm db:migrate
pnpm db:seed

# 启动开发服务器
pnpm dev
```

打开 http://localhost:3000

## 常用命令

```bash
pnpm dev          # 开发服务器
pnpm build        # 生产构建
pnpm start        # 运行生产构建
pnpm lint         # ESLint

pnpm db:migrate   # 应用 schema 迁移
pnpm db:generate  # 重新生成 Prisma 客户端
pnpm db:studio    # 数据库可视化管理
pnpm db:seed      # 灌入示例数据
pnpm db:reset     # 清空并重建数据库
```

## 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局：字体、Header、Toast、表单面板、@modal 插槽
│   ├── page.tsx                # Journal 首页（卡片网格 + 筛选）
│   ├── collections/            # 收藏页
│   ├── map/                    # 地图分区页
│   ├── about/                  # 关于页（含统计）
│   ├── entries/[id]/           # 详情整页（直链/刷新）
│   ├── @modal/(.)entries/[id]/ # 详情弹窗（拦截路由）
│   ├── api/entries/[id]/       # 编辑面板取数 API
│   ├── actions.ts              # Server Actions（CRUD + 收藏）
│   ├── loading.tsx             # 骨架屏
│   ├── error.tsx               # 错误边界
│   └── not-found.tsx           # 404
├── components/                 # UI 组件
├── lib/
│   ├── prisma.ts               # Prisma 客户端单例
│   ├── queries.ts              # 数据查询
│   ├── schema.ts               # Zod 校验
│   ├── format.ts               # 格式化工具
│   └── regions.ts              # 国家→地区映射
└── generated/prisma/           # Prisma 生成的客户端（不提交）
```

## 设计要点

- **URL 即状态**：筛选（`?q=&country=&rating=&sort=`）、详情（`/entries/{id}`）、新建/编辑（`?new=1` / `?edit={id}`）全部编码进 URL，可分享、可刷新恢复。
- **拦截路由**：列表点卡片弹 modal，刷新/直链落到完整页面。
- **Server Actions + Zod**：所有写操作在服务端校验，`revalidatePath` 自动刷新。
- **SQLite 标签存储**：`tags` 以 JSON 字符串存于 `tagsJson` 字段（SQLite 无原生数组），切到 Postgres 后可改为 `String[]`。

## 注意事项

- `.env` 中的 `DATABASE_URL` 默认 `file:./dev.db`，不提交。
- `dev.db` 是本地数据库文件，已被 git 忽略。
- 图片域名当前放开所有 https 源（个人单用户场景）；多用户场景应收紧 `next.config.ts` 的 `remotePatterns`。
- 已知问题：访问不存在的 `/entries/{id}` 时，404 UI 渲染正确，但 HTTP 状态码会是 200（Next.js 16 并行路由 + `notFound()` 的已知交互）。用户体验不受影响，对 SEO 有轻微影响。
