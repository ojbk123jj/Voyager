export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="col-span-full px-8 py-16 text-center">
      <h2 className="font-display text-[2rem] font-light text-ink-muted">
        {title}
      </h2>
      {hint ? <p className="mt-2 text-ink-light">{hint}</p> : null}
    </div>
  );
}
