import { getStats } from "@/lib/queries";

export type HeroVariant = "journal" | "collections" | "map" | "about";

const headings: Record<HeroVariant, React.ReactNode> = {
  journal: (
    <>
      Every journey leaves <em className="italic text-accent">a story</em> worth
      telling.
    </>
  ),
  collections: (
    <>
      The ones that <em className="italic text-accent">stole your heart</em>.
    </>
  ),
  map: (
    <>
      Your world, <em className="italic text-accent">charted</em>.
    </>
  ),
  about: (
    <>
      About <em className="italic text-accent">Voyager</em>
    </>
  ),
};

async function getStatsData() {
  const { destinations, countries, favorites } = await getStats();
  return { destinations, countries, favorites };
}

export async function Hero({ variant = "journal" }: { variant?: HeroVariant }) {
  const stats = await getStatsData();

  return (
    <section className="mx-auto max-w-[1400px] px-8 pt-12 pb-6">
      {/* Stats */}
      <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
        <Stat label="Destinations" value={stats.destinations} />
        <Divider />
        <Stat label="Countries" value={stats.countries} />
        <Divider />
        <Stat label="Favorites" value={stats.favorites} />
      </div>

      {/* Heading */}
      <h1 className="mt-6 font-display text-[3.2rem] font-light leading-[1.2] tracking-tight text-ink">
        {headings[variant]}
      </h1>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="stat-number font-display text-[3.5rem] font-normal leading-none tracking-tight text-accent">
        {value}
      </span>
      <span className="mt-1 text-[0.85rem] uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="hidden h-12 w-px bg-line sm:block" />;
}
