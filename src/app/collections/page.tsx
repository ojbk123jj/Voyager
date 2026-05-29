import { Hero } from "@/components/hero";

export default function CollectionsPage() {
  return (
    <>
      <Hero variant="collections" />
      <main className="mx-auto max-w-[1400px] px-8 pb-16">
        <p className="text-ink-muted">
          收藏夹将在 Phase 5 实现。
        </p>
      </main>
    </>
  );
}
