"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { entryInputSchema } from "@/lib/schema";

export type ActionState = {
  ok: boolean;
  error?: string;
  /** 字段级错误，key 为字段名 */
  fieldErrors?: Record<string, string[]>;
};

/**
 * 写操作后统一刷新所有会受影响的页面（列表/收藏/地图/关于的统计）。
 */
function revalidateAll(id?: string) {
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/map");
  revalidatePath("/about");
  if (id) revalidatePath(`/entries/${id}`);
}

/**
 * 从 FormData 解析出表单对象。tags 以隐藏字段里的 JSON 字符串传递。
 */
function parseForm(formData: FormData) {
  let tags: string[] = [];
  const rawTags = formData.get("tags");
  if (typeof rawTags === "string" && rawTags) {
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) tags = parsed.map(String);
    } catch {
      tags = [];
    }
  }

  return {
    destination: String(formData.get("destination") ?? ""),
    country: String(formData.get("country") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    rating: String(formData.get("rating") ?? "0"),
    review: String(formData.get("review") ?? ""),
    mood: String(formData.get("mood") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    tags,
  };
}

export async function createEntry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = entryInputSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const d = parsed.data;
  await prisma.entry.create({
    data: {
      destination: d.destination,
      country: d.country,
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      rating: d.rating,
      review: d.review,
      mood: d.mood || null,
      imageUrl: d.imageUrl || null,
      tagsJson: JSON.stringify(d.tags),
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function updateEntry(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const exists = await prisma.entry.findUnique({ where: { id } });
  if (!exists) return { ok: false, error: "Entry not found." };

  const parsed = entryInputSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const d = parsed.data;
  await prisma.entry.update({
    where: { id },
    data: {
      destination: d.destination,
      country: d.country,
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      rating: d.rating,
      review: d.review,
      mood: d.mood || null,
      imageUrl: d.imageUrl || null,
      tagsJson: JSON.stringify(d.tags),
    },
  });

  revalidateAll(id);
  return { ok: true };
}

/**
 * 删除后跳回首页（详情页/弹窗里删除时尤其需要）
 */
export async function deleteEntry(id: string) {
  await prisma.entry.delete({ where: { id } }).catch(() => {
    // 已经不存在就当作成功
  });
  revalidateAll();
  redirect("/");
}

export async function toggleFavorite(id: string) {
  const entry = await prisma.entry.findUnique({
    where: { id },
    select: { favorite: true },
  });
  if (!entry) return;
  await prisma.entry.update({
    where: { id },
    data: { favorite: !entry.favorite },
  });
  revalidateAll(id);
}
