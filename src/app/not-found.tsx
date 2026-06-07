import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[600px] flex-col items-center justify-center px-8 text-center">
      <span className="font-display text-[5rem] font-light leading-none text-accent">
        404
      </span>
      <h1 className="mt-2 font-display text-[2rem] font-light text-ink">
        This page is <em className="italic text-accent">off the map</em>.
      </h1>
      <p className="mt-3 text-ink-muted">
        The destination you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-[0_2px_8px_rgb(193_127_89/0.3)] transition-all duration-200 hover:bg-accent-dark"
      >
        Back to journal
      </Link>
    </main>
  );
}
