import { Hero } from "@/components/hero";
import { getStats } from "@/lib/queries";

export default async function AboutPage() {
  const { destinations, countries, avgRating, favorites } = await getStats();

  return (
    <>
      <Hero variant="about" />
      <main className="mx-auto max-w-[1400px] px-8 pb-16">
        <div className="py-4">
          {/* tagline */}
          <div className="relative pb-12 pt-8 text-center">
            <div className="mb-6">
              <span className="inline-flex size-18 items-center justify-center rounded-full bg-accent text-3xl text-white shadow-[0_8px_32px_rgb(193_127_89/0.3)]">
                ✦
              </span>
            </div>
            <p className="font-display text-2xl italic tracking-wide text-ink-muted">
              Capture the essence of every journey.
            </p>
            <span className="absolute bottom-0 left-1/2 h-0.5 w-15 -translate-x-1/2 bg-gold" />
          </div>

          {/* 正文 */}
          <div className="mx-auto max-w-[600px] py-8">
            <p className="text-base font-light leading-[1.9] text-ink">
              Voyager is your personal travel companion — a space to document
              the places that moved you, the flavors that surprised you, and the
              moments that made you feel alive. Each entry is a page in your own
              travelogue, written by you, for you.
            </p>
            <p className="mt-5 text-base font-light leading-[1.9] text-ink">
              Born from a love of storytelling and wanderlust, Voyager combines
              the elegance of a leather-bound journal with the convenience of
              the digital age. No ads. No algorithms. Just your memories,
              beautifully arranged.
            </p>
          </div>

          {/* 统计条 */}
          <div className="mx-auto flex max-w-[500px] flex-wrap items-center justify-center gap-10 py-8">
            <AboutStat value={destinations} label="Destinations" />
            <StatDivider />
            <AboutStat value={countries} label="Countries" />
            <StatDivider />
            <AboutStat value={avgRating} label="Avg Rating" />
            <StatDivider />
            <AboutStat value={favorites} label="Favorites" />
          </div>
        </div>
      </main>
    </>
  );
}

function AboutStat({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-[2rem] font-medium text-accent">
        {value}
      </span>
      <span className="mt-0.5 text-[0.78rem] uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </span>
    </div>
  );
}

function StatDivider() {
  return <span aria-hidden className="hidden h-9 w-px bg-line sm:block" />;
}
