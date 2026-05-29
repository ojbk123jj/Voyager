import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateRange, gradientFor, parseTags } from "@/lib/format";
import type { Entry } from "@/generated/prisma/models";

type Props = {
  entry: Entry;
  /** 用于错落动画延迟 */
  index?: number;
};

export function EntryCard({ entry, index = 0 }: Props) {
  const tags = parseTags(entry.tagsJson);
  const gradient = gradientFor(entry.id);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-card bg-surface",
        "shadow-[0_1px_2px_rgb(30_27_24/0.04)]",
        "transition-all duration-300 ease-smooth",
        "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(30_27_24/0.09),0_4px_12px_rgb(30_27_24/0.04)]",
        "card-fade-in",
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* —— 封面 —— */}
      <div
        className="relative aspect-4/3 w-full overflow-hidden"
        style={entry.imageUrl ? undefined : { background: gradient }}
      >
        {entry.imageUrl ? (
          <Image
            src={entry.imageUrl}
            alt={entry.destination}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
            unoptimized
          />
        ) : null}
        {/* 底部暗色渐变，让白字可读 */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgb(30_27_24/0.35)_100%)]" />

        {/* 收藏按钮（占位，Phase 6 接 Server Action） */}
        <button
          type="button"
          aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}
          className={cn(
            "absolute left-4 top-4 z-10 flex size-9 items-center justify-center rounded-full",
            "bg-white/90 backdrop-blur-md shadow-md transition-transform duration-200",
            "hover:scale-110",
          )}
        >
          <Heart
            className={cn("size-4", entry.favorite && "fill-danger")}
            color="#C1554F"
            strokeWidth={2}
          />
        </button>

        {/* Mood */}
        {entry.mood ? (
          <span
            aria-hidden
            className={cn(
              "absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full",
              "bg-white/90 backdrop-blur-md text-base shadow-md",
              "transition-transform duration-200 group-hover:scale-110",
            )}
          >
            {entry.mood}
          </span>
        ) : null}

        {/* 地点（在封面上） */}
        <h3
          className={cn(
            "absolute bottom-4 left-5 z-10",
            "font-display text-[1.3rem] font-medium tracking-wide text-white",
            "drop-shadow-[0_1px_4px_rgb(0_0_0/0.3)]",
          )}
        >
          {entry.destination}
        </h3>
      </div>

      {/* —— 文字部分 —— */}
      <div className="px-[1.3rem] py-5">
        <div className="text-[0.82rem] uppercase tracking-[0.08em] text-ink-muted">
          {formatDateRange(entry.startDate, entry.endDate)} · {entry.country}
        </div>

        <Stars rating={entry.rating} className="mt-2" />

        <p
          className={cn(
            "mt-2 text-[0.92rem] font-light leading-[1.65] text-ink",
            "line-clamp-3",
          )}
        >
          {entry.review.split("\n\n")[0]}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {tags.length > 3 ? <Tag>+{tags.length - 3}</Tag> : null}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[0.85rem] font-medium tracking-wide text-accent group-hover:text-accent-dark">
            Read more →
          </span>
        </div>
      </div>
    </article>
  );
}

/* —— 子部件 —— */

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full bg-tag-bg px-2.5 py-1 text-[0.72rem] font-medium",
        "uppercase tracking-[0.04em] text-tag-text",
      )}
    >
      {children}
    </span>
  );
}

export function Stars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={`${rating} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={i < rating ? "text-star" : "text-star-empty"}
        >
          ★
        </span>
      ))}
    </div>
  );
}
