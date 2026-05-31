"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOODS } from "@/lib/schema";

/* ===================== 星级输入 ===================== */
export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1 text-[1.6rem]" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className={cn(
            "leading-none transition-transform duration-150 hover:scale-110",
            (hover || value) >= n ? "text-star" : "text-star-empty",
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/* ===================== Mood 选择 ===================== */
export function MoodSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((m) => (
        <button
          key={m.value}
          type="button"
          title={m.label}
          aria-pressed={value === m.value}
          onClick={() => onChange(value === m.value ? "" : m.value)}
          className={cn(
            "flex size-10 items-center justify-center rounded-full border-2 text-lg",
            "transition-all duration-150 hover:scale-105",
            value === m.value
              ? "border-accent bg-accent/10"
              : "border-line bg-surface hover:border-accent",
          )}
        >
          {m.value}
        </button>
      ))}
    </div>
  );
}

/* ===================== Tags 输入 ===================== */
export function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const t = draft.trim();
    if (t && !value.includes(t) && value.length < 12) {
      onChange([...value, t]);
    }
    setDraft("");
  }

  return (
    <div
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border border-line",
        "bg-surface px-2.5 py-2 transition-all duration-150",
        "focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgb(193_127_89/0.15)]",
      )}
      onClick={(e) => {
        const input = e.currentTarget.querySelector("input");
        input?.focus();
      }}
    >
      {value.map((tag, i) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-tag-bg px-2.5 py-1 text-[0.8rem] text-tag-text"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              onChange(value.filter((_, idx) => idx !== i));
            }}
            className="text-ink-muted hover:text-danger"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={value.length ? "" : "Add tag and press Enter..."}
        className="flex-1 border-none bg-transparent text-[0.9rem] text-ink outline-none placeholder:text-ink-light"
      />
    </div>
  );
}
