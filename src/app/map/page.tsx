import { Hero } from "@/components/hero";

export default function MapPage() {
  return (
    <>
      <Hero variant="map" />
      <main className="mx-auto max-w-[1400px] px-8 pb-16">
        <p className="text-ink-muted">
          地图视图（按地区/国家分组）将在 Phase 5 实现。
        </p>
      </main>
    </>
  );
}
