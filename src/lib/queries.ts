import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type SortKey = "date-desc" | "date-asc" | "rating-desc" | "rating-asc";

const SORT_MAP: Record<SortKey, Prisma.EntryOrderByWithRelationInput[]> = {
  "date-desc": [{ startDate: "desc" }],
  "date-asc": [{ startDate: "asc" }],
  "rating-desc": [{ rating: "desc" }, { startDate: "desc" }],
  "rating-asc": [{ rating: "asc" }, { startDate: "desc" }],
};

export type EntryFilters = {
  q?: string;
  country?: string;
  /** 最低星级 1..5 */
  minRating?: number;
  sort?: SortKey;
};

export async function listEntries(filters: EntryFilters = {}) {
  const { q, country, minRating, sort = "date-desc" } = filters;

  // 注意：SQLite 没有原生大小写不敏感模式；mode: "insensitive" 这里实际是不生效的，
  // 但 SQLite 默认 LIKE 就是大小写不敏感（对 ASCII），刚好够用。
  const where: Prisma.EntryWhereInput = {
    ...(country ? { country } : {}),
    ...(minRating ? { rating: { gte: minRating } } : {}),
    ...(q
      ? {
          OR: [
            { destination: { contains: q } },
            { country: { contains: q } },
            { review: { contains: q } },
            { tagsJson: { contains: q } }, // tags 是 JSON 字符串，用模糊搜
          ],
        }
      : {}),
  };

  const orderBy = SORT_MAP[sort] ?? SORT_MAP["date-desc"];

  const [entries, total] = await Promise.all([
    prisma.entry.findMany({ where, orderBy }),
    prisma.entry.count(),
  ]);

  return { entries, total, filtered: entries.length };
}

/**
 * 获取所有出现过的国家（用于筛选下拉框）
 */
export async function listCountries() {
  const rows = await prisma.entry.findMany({
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });
  return rows.map((r) => r.country);
}

/**
 * 按 id 取单条；不存在返回 null（页面据此 notFound）
 */
export async function getEntry(id: string) {
  return prisma.entry.findUnique({ where: { id } });
}

/**
 * 收藏的条目（Collections 页）
 */
export async function listFavorites() {
  return prisma.entry.findMany({
    where: { favorite: true },
    orderBy: { startDate: "desc" },
  });
}

/**
 * 全局聚合统计（About / Hero 用）
 */
export async function getStats() {
  const all = await prisma.entry.findMany({
    select: { country: true, favorite: true, rating: true },
  });
  const destinations = all.length;
  const countries = new Set(all.map((e) => e.country)).size;
  const favorites = all.filter((e) => e.favorite).length;
  const avgRating =
    all.length > 0
      ? (all.reduce((s, e) => s + e.rating, 0) / all.length).toFixed(1)
      : "0.0";
  return { destinations, countries, favorites, avgRating };
}
