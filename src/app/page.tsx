import { Hero } from "@/components/hero";
import { prisma } from "@/lib/prisma";

export default async function JournalPage() {
  const entries = await prisma.entry.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <>
      <Hero variant="journal" />
      <main className="mx-auto max-w-[1400px] px-8 pb-16">
        {/* TODO Phase 2: 卡片网格 + 搜索/筛选/排序 */}
        <p className="text-ink-muted">
          {entries.length} entries loaded · 卡片网格将在 Phase 2 实现。
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-ink/80">
          {entries.map((e) => (
            <li key={e.id}>
              <span className="font-display text-base text-ink">
                {e.destination}
              </span>{" "}
              · {e.country} · {"★".repeat(e.rating)}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
