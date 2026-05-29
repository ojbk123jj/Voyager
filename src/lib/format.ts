/**
 * 卡片占位渐变（无封面图时用），与原 index.html 保持一致
 */
export const cardGradients = [
  "linear-gradient(135deg, #7BA7BC 0%, #4A7C8E 100%)",
  "linear-gradient(135deg, #8B9D83 0%, #5C7A5A 100%)",
  "linear-gradient(135deg, #D4A76A 0%, #B8733A 100%)",
  "linear-gradient(135deg, #9B8FA0 0%, #6B5E70 100%)",
  "linear-gradient(135deg, #7BB8A8 0%, #3D8B7A 100%)",
  "linear-gradient(135deg, #B8C5A0 0%, #8A9A6E 100%)",
  "linear-gradient(135deg, #E8A87C 0%, #C97B5D 100%)",
  "linear-gradient(135deg, #9BB5CE 0%, #6B8DA8 100%)",
  "linear-gradient(135deg, #C4A88B 0%, #9B7B5E 100%)",
  "linear-gradient(135deg, #A8C4D8 0%, #7A9AB5 100%)",
] as const;

export function gradientFor(seed: string | number) {
  // 用字符串 hash 让同一条目稳定拿到同一渐变
  const n =
    typeof seed === "number"
      ? seed
      : Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return cardGradients[n % cardGradients.length];
}

/**
 * 日期范围格式化：Mar 12 – Mar 24, 2025
 */
export function formatDateRange(start: Date, end: Date) {
  const sameYear = start.getFullYear() === end.getFullYear();
  const startFmt = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endFmt = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return sameYear
    ? `${startFmt} – ${endFmt}`
    : `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} – ${endFmt}`;
}

/**
 * tagsJson → string[]，对损坏数据做兜底
 */
export function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    return [];
  }
}
