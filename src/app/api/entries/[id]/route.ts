import { NextResponse } from "next/server";
import { getEntry } from "@/lib/queries";
import { parseTags } from "@/lib/format";

/**
 * 供编辑面板按 id 拉取条目（客户端 fetch 用）。
 * 把 tagsJson 解析成数组、日期转成 yyyy-mm-dd，方便直接灌进表单。
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    id: entry.id,
    destination: entry.destination,
    country: entry.country,
    startDate: entry.startDate.toISOString().slice(0, 10),
    endDate: entry.endDate.toISOString().slice(0, 10),
    rating: entry.rating,
    review: entry.review,
    mood: entry.mood ?? "",
    imageUrl: entry.imageUrl ?? "",
    tags: parseTags(entry.tagsJson),
  });
}
