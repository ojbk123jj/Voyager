import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EntryDetail } from "@/components/entry-detail";
import { getEntry } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) return { title: "Not found" };
  return {
    title: `${entry.destination}, ${entry.country}`,
    description: entry.review.slice(0, 160),
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) notFound();

  return (
    <main className="mx-auto max-w-[680px] px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-4" /> Back to journal
      </Link>

      <article className="overflow-hidden rounded-modal bg-surface shadow-[0_12px_40px_rgb(30_27_24/0.09)]">
        <EntryDetail entry={entry} />
      </article>
    </main>
  );
}
