import { Hero } from "@/components/hero";
import { Controls } from "@/components/controls";
import { EntryCard } from "@/components/entry-card";
import { EmptyState } from "@/components/empty-state";
import { listCountries, listEntries, type SortKey } from "@/lib/queries";

const VALID_SORTS: SortKey[] = [
  "date-desc",
  "date-asc",
  "rating-desc",
  "rating-asc",
];

type SearchParams = Promise<{
  q?: string;
  country?: string;
  rating?: string;
  sort?: string;
}>;

export default async function JournalPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const sort = (VALID_SORTS as string[]).includes(sp.sort ?? "")
    ? (sp.sort as SortKey)
    : "date-desc";

  const minRating = sp.rating ? parseInt(sp.rating, 10) : undefined;

  const [{ entries, total, filtered }, countries] = await Promise.all([
    listEntries({
      q: sp.q?.trim() || undefined,
      country: sp.country || undefined,
      minRating: Number.isFinite(minRating) ? minRating : undefined,
      sort,
    }),
    listCountries(),
  ]);

  return (
    <>
      <Hero variant="journal" />
      <Controls countries={countries} total={total} filtered={filtered} />

      <main className="mx-auto max-w-[1400px] px-8 pb-16">
        {entries.length === 0 ? (
          <EmptyState
            title="No entries found"
            hint="Try adjusting your filters or add a new travel memory."
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
