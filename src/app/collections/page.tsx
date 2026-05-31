import { Hero } from "@/components/hero";
import { EntryCard } from "@/components/entry-card";
import { EmptyState } from "@/components/empty-state";
import { listFavorites } from "@/lib/queries";

export default async function CollectionsPage() {
  const favorites = await listFavorites();

  return (
    <>
      <Hero variant="collections" />
      <main className="mx-auto max-w-[1400px] px-8 pb-16">
        {favorites.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            hint="Tap the heart icon on an entry to add it to your curated collection."
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
