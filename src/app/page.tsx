import { prisma } from "@/lib/prisma";

export default async function Home() {
  const entries = await prisma.entry.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#FCF9F2] p-8">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-serif text-[#1E1B18]">
          Voyager <span className="text-[#C17F59] italic">— sanity check</span>
        </h1>
        <p className="text-[#8B8178] mt-2">
          {entries.length} entries loaded from SQLite via Prisma.
        </p>
      </header>

      <ul className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <li
            key={e.id}
            className="bg-white rounded-lg p-5 shadow-sm border border-[#E8E0D5]"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-serif text-[#1E1B18]">
                {e.destination}
              </h2>
              <span className="text-sm text-[#8B8178]">{e.country}</span>
            </div>
            <div className="text-[#D4A84B] mt-1">
              {"★".repeat(e.rating)}
              <span className="text-[#D8CFC2]">{"★".repeat(5 - e.rating)}</span>
            </div>
            <p className="text-sm text-[#1E1B18]/80 mt-2 line-clamp-3">
              {e.review}
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {(JSON.parse(e.tagsJson) as string[]).map((t) => (
                <span
                  key={t}
                  className="text-xs bg-[#F0EAE0] text-[#6B5E53] px-2 py-0.5 rounded-full uppercase tracking-wide"
                >
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
