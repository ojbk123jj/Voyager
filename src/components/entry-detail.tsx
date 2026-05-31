import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Stars } from "@/components/entry-card";
import { formatDateRange, gradientFor, parseTags } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Entry } from "@/generated/prisma/client";

/**
 * 详情主体，弹窗 (modal) 和独立页面 (/entries/[id]) 共用。
 * 不含外层容器/关闭按钮，由各自的包裹层提供。
 */
export function EntryDetail({ entry }: { entry: Entry }) {
  const tags = parseTags(entry.tagsJson);
  const paragraphs = entry.review.split("\n\n").filter((p) => p.trim());

  return (
    <>
      {/* 封面 */}
      <div
        className="relative aspect-video w-full overflow-hidden"
        style={entry.imageUrl ? undefined : { background: gradientFor(entry.id) }}
      >
        {entry.imageUrl ? (
          <Image
            src={entry.imageUrl}
            alt={entry.destination}
            fill
            sizes="(max-width: 640px) 95vw, 620px"
            className="object-cover"
            unoptimized
            priority
          />
        ) : null}
      </div>

      {/* 正文 */}
      <div className="px-9 py-8">
        <h2 className="flex items-center gap-3 font-display text-[2rem] font-normal tracking-wide text-ink">
          {entry.destination}
          {entry.mood ? (
            <span aria-hidden className="text-[1.4rem]">
              {entry.mood}
            </span>
          ) : null}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-[0.85rem] uppercase tracking-[0.08em] text-ink-muted">
            {formatDateRange(entry.startDate, entry.endDate)} · {entry.country}
          </span>
          <Stars rating={entry.rating} />
        </div>

        <div className="mt-5 space-y-4 text-base font-light leading-[1.8] text-ink">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-full bg-tag-bg px-2.5 py-1 text-[0.72rem] font-medium",
                  "uppercase tracking-[0.04em] text-tag-text",
                )}
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* 操作（Phase 4 接 Server Action） */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-line px-3.5 py-2",
              "text-[0.82rem] font-medium text-ink-muted transition-colors",
              "hover:border-accent hover:text-accent hover:bg-accent/10",
            )}
          >
            <Pencil className="size-3.5" /> Edit
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-[#E8C8C5] px-3.5 py-2",
              "text-[0.82rem] font-medium text-danger transition-colors",
              "hover:bg-[#FDF2F1] hover:border-danger",
            )}
          >
            <Trash2 className="size-3.5" /> Delete
          </button>
        </div>
      </div>
    </>
  );
}
