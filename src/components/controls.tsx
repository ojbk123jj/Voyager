"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useDeferredValue } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  countries: string[];
  /** 用于在右侧显示 "X of Y entries" */
  total: number;
  filtered: number;
};

/**
 * URL 即状态：所有筛选/排序参数都同步到 ?q=...&country=...&rating=...&sort=...
 * - useTransition 让 URL 更新不会阻塞输入
 * - useDeferredValue 让搜索输入有内置防抖体验（输入流畅，搜索稍滞后）
 */
export function Controls({ countries, total, filtered }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 搜索框是受控的，其他 select 直接读 params
  const [q, setQ] = useState(() => params.get("q") ?? "");
  const deferredQ = useDeferredValue(q);

  const country = params.get("country") ?? "";
  const rating = params.get("rating") ?? "";
  const sort = params.get("sort") ?? "date-desc";

  // 当输入稳定后才推 URL，避免每个字符都触发一次服务端查询
  useEffect(() => {
    const next = new URLSearchParams(params.toString());
    if (deferredQ) next.set("q", deferredQ);
    else next.delete("q");
    const nextStr = next.toString();
    if (nextStr === params.toString()) return;
    startTransition(() => {
      router.replace(nextStr ? `/?${nextStr}` : "/", { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredQ]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const str = next.toString();
    startTransition(() => {
      router.replace(str ? `/?${str}` : "/", { scroll: false });
    });
  }

  return (
    <section
      className={cn(
        "mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-8 pt-4 pb-8",
        isPending && "opacity-90",
      )}
    >
      {/* 搜索框 */}
      <div className="relative min-w-[240px] flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-light" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search destinations, countries, or tags..."
          className={cn(
            "w-full rounded-xl border border-line bg-surface px-4 py-3 pl-11",
            "text-[0.95rem] text-ink placeholder:text-ink-light",
            "outline-none transition-all duration-200",
            "focus:border-accent focus:shadow-[0_0_0_3px_rgb(193_127_89/0.15)]",
          )}
        />
      </div>

      {/* 三个 select */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={country}
          onChange={(v) => setParam("country", v)}
          aria-label="Filter by country"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select
          value={rating}
          onChange={(v) => setParam("rating", v)}
          aria-label="Filter by rating"
        >
          <option value="">All Ratings</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★+</option>
          <option value="3">★★★+</option>
        </Select>

        <Select
          value={sort}
          onChange={(v) => setParam("sort", v)}
          aria-label="Sort by"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="rating-asc">Lowest Rated</option>
        </Select>
      </div>

      {/* 结果计数 */}
      <span className="ml-auto whitespace-nowrap text-[0.85rem] text-ink-muted">
        {filtered === total
          ? `${total} ${total === 1 ? "entry" : "entries"}`
          : `${filtered} of ${total} ${total === 1 ? "entry" : "entries"}`}
      </span>
    </section>
  );
}

/* —— 自定义样式 select —— */

function Select({
  children,
  value,
  onChange,
  ...rest
}: {
  children: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange">) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
      className={cn(
        "appearance-none rounded-xl border border-line bg-surface",
        "py-2.5 pl-4 pr-9 text-[0.9rem] text-ink",
        "cursor-pointer outline-none transition-colors duration-150",
        "focus:border-accent",
        // 自定义箭头（SVG 走 public/ 静态文件，避免在 class 里写 data URI 时的转义地狱）
        "bg-[url('/chevron-down.svg')] bg-no-repeat",
        "bg-size-[12px_7px] bg-position-[right_0.85rem_center]",
      )}
    >
      {children}
    </select>
  );
}
