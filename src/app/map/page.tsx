import Link from "next/link";
import { Hero } from "@/components/hero";
import { EmptyState } from "@/components/empty-state";
import { Stars } from "@/components/entry-card";
import { prisma } from "@/lib/prisma";
import { emojiFor, regionFor } from "@/lib/regions";
import { cn } from "@/lib/utils";
import type { Entry } from "@/generated/prisma/client";

export const metadata = { title: "Map" };

type CountryGroup = { country: string; items: Entry[] };

function groupByRegion(entries: Entry[]) {
  // 先按国家归类
  const byCountry = new Map<string, Entry[]>();
  for (const e of entries) {
    const arr = byCountry.get(e.country) ?? [];
    arr.push(e);
    byCountry.set(e.country, arr);
  }
  // 再按地区归类
  const byRegion = new Map<string, CountryGroup[]>();
  for (const [country, items] of byCountry) {
    const region = regionFor(country);
    const arr = byRegion.get(region) ?? [];
    arr.push({ country, items });
    byRegion.set(region, arr);
  }
  return byRegion;
}

export default async function MapPage() {
  const entries = await prisma.entry.findMany({
    orderBy: { startDate: "desc" },
  });

  if (entries.length === 0) {
    return (
      <>
        <Hero variant="map" />
        <main className="mx-auto max-w-[1400px] px-8 pb-16">
          <EmptyState
            title="Your map is empty"
            hint="Add your first travel entry to start charting the world."
          />
        </main>
      </>
    );
  }

  const byRegion = groupByRegion(entries);

  return (
    <>
      <Hero variant="map" />
      <main className="mx-auto max-w-[1400px] px-8 pb-16">
        {[...byRegion.entries()].map(([region, countries]) => (
          <section key={region} className="mb-10">
            <h2 className="mb-4 border-b border-line pb-2 font-display text-[1.4rem] font-normal tracking-wide text-ink-muted">
              {region}
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {countries.map(({ country, items }) => {
                const avg = (
                  items.reduce((s, e) => s + e.rating, 0) / items.length
                ).toFixed(1);
                return (
                  <div
                    key={country}
                    className={cn(
                      "rounded-xl bg-surface p-6 shadow-[0_1px_2px_rgb(30_27_24/0.04)]",
                      "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(30_27_24/0.06)]",
                    )}
                  >
                    <div className="mb-3 flex items-center gap-3 border-b border-line pb-3">
                      <span className="text-3xl">{emojiFor(country)}</span>
                      <div>
                        <h3 className="font-display text-[1.15rem] font-medium text-ink">
                          {country}
                        </h3>
                        <span className="text-[0.78rem] uppercase tracking-[0.06em] text-ink-muted">
                          {items.length} destination
                          {items.length !== 1 ? "s" : ""} · avg {avg}
                        </span>
                      </div>
                    </div>
                    <div>
                      {items.map((e) => (
                        <Link
                          key={e.id}
                          href={`/entries/${e.id}`}
                          scroll={false}
                          className={cn(
                            "flex items-center justify-between border-b border-line py-2 last:border-b-0",
                            "text-[0.92rem] text-ink transition-all duration-150",
                            "hover:pl-1 hover:text-accent",
                          )}
                        >
                          <span>{e.destination}</span>
                          <Stars rating={e.rating} className="text-[0.82rem]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
