import { cn } from "@/lib/utils";

/**
 * 卡片骨架，路由加载时占位。
 */
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card bg-surface shadow-[0_1px_2px_rgb(30_27_24/0.04)]">
      <div className="aspect-4/3 w-full animate-pulse bg-surface-alt" />
      <div className="space-y-3 px-[1.3rem] py-5">
        <div className="h-3 w-2/3 animate-pulse rounded bg-surface-alt" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-surface-alt" />
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full animate-pulse rounded bg-surface-alt" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-surface-alt" />
        </div>
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-14 animate-pulse rounded-full bg-surface-alt" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-surface-alt" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className={cn(
        "mx-auto max-w-[1400px] px-8 pb-16",
        "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
