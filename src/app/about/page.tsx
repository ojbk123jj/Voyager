import { Hero } from "@/components/hero";

export default function AboutPage() {
  return (
    <>
      <Hero variant="about" />
      <main className="mx-auto max-w-[1400px] px-8 pb-16">
        <div className="mx-auto max-w-[600px] py-8">
          <p className="text-base font-light leading-[1.9] text-ink">
            Voyager is your personal travel companion — a space to document the
            places that moved you, the flavors that surprised you, and the
            moments that made you feel alive. Each entry is a page in your own
            travelogue, written by you, for you.
          </p>
          <p className="mt-5 text-base font-light leading-[1.9] text-ink">
            Born from a love of storytelling and wanderlust, Voyager combines
            the elegance of a leather-bound journal with the convenience of the
            digital age. No ads. No algorithms. Just your memories, beautifully
            arranged.
          </p>
        </div>
      </main>
    </>
  );
}
