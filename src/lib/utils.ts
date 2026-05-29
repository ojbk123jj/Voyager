import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 className 的标准工具：clsx + tailwind-merge
 * 支持条件 class 和 Tailwind 冲突解析（如 "p-2 p-4" → "p-4"）
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
