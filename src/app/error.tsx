"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 真实部署时这里可以接入日志上报
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[600px] flex-col items-center justify-center px-8 text-center">
      <h1 className="font-display text-[2.5rem] font-light text-ink">
        Something went <em className="italic text-accent">sideways</em>.
      </h1>
      <p className="mt-3 text-ink-muted">
        An unexpected error occurred while loading this page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-[0_2px_8px_rgb(193_127_89/0.3)] transition-all duration-200 hover:bg-accent-dark"
      >
        Try again
      </button>
    </main>
  );
}
