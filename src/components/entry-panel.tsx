"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/toast";
import { StarRatingInput, MoodSelector, TagsInput } from "@/components/form-fields";
import { createEntry, updateEntry, type ActionState } from "@/app/actions";

const EMPTY = {
  destination: "",
  country: "",
  startDate: "",
  endDate: "",
  rating: 0,
  review: "",
  mood: "",
  imageUrl: "",
  tags: [] as string[],
};

type FormShape = typeof EMPTY;

const initialState: ActionState = { ok: false };

export function EntryPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();

  const isNew = params.get("new") === "1";
  const editId = params.get("edit");
  const open = isNew || !!editId;

  const [form, setForm] = useState<FormShape>(EMPTY);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // 绑定 action（区分新建/编辑）
  const action = editId
    ? updateEntry.bind(null, editId)
    : createEntry;
  const [state, formAction, pending] = useActionState(action, initialState);

  const close = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete("new");
    next.delete("edit");
    const str = next.toString();
    router.replace(str ? `?${str}` : window.location.pathname, {
      scroll: false,
    });
  }, [params, router]);

  // 打开时：新建→清空；编辑→拉数据
  useEffect(() => {
    if (!open) return;
    if (isNew) {
      setForm(EMPTY);
      return;
    }
    if (editId) {
      setLoading(true);
      fetch(`/api/entries/${editId}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data: FormShape) => setForm(data))
        .catch(() => {
          toast("Could not load entry");
          close();
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isNew, editId]);

  // 提交成功后关闭 + toast
  useEffect(() => {
    if (state.ok) {
      toast(editId ? "Entry updated" : "New memory saved!");
      close();
    } else if (state.error) {
      toast(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // ESC 关闭 + 锁滚动
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const fieldErr = (k: string) => state.fieldErrors?.[k]?.[0];

  return (
    <>
      {/* 遮罩 */}
      <div
        onClick={close}
        className={cn(
          "fixed inset-0 z-200 bg-ink/40 backdrop-blur-xs transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* 抽屉 */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-201 h-screen w-[480px] max-w-full overflow-y-auto bg-surface p-8",
          "shadow-[0_24px_64px_rgb(30_27_24/0.12)] transition-transform duration-300 ease-smooth",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-[1.6rem] font-normal tracking-wide">
            {editId ? "Edit Entry" : "New Journal Entry"}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-full bg-surface-alt text-ink-muted transition-colors hover:bg-[#EDE5D9] hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        {loading ? (
          <p className="text-ink-muted">Loading…</p>
        ) : (
          <form ref={formRef} action={formAction} className="space-y-5">
            {/* hidden 字段，承载非原生 input 的值 */}
            <input type="hidden" name="rating" value={form.rating} />
            <input type="hidden" name="mood" value={form.mood} />
            <input type="hidden" name="tags" value={JSON.stringify(form.tags)} />

            <Field label="Destination" error={fieldErr("destination")}>
              <input
                name="destination"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="e.g. Kyoto, Santorini..."
                className={inputCls}
              />
            </Field>

            <Field label="Country" error={fieldErr("country")}>
              <input
                name="country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="e.g. Japan, Greece..."
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="From" error={fieldErr("startDate")}>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="To" error={fieldErr("endDate")}>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Rating" error={fieldErr("rating")}>
              <StarRatingInput
                value={form.rating}
                onChange={(v) => setForm({ ...form, rating: v })}
              />
            </Field>

            <Field label="Your Review" error={fieldErr("review")}>
              <textarea
                name="review"
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                placeholder="What made this journey unforgettable..."
                rows={5}
                className={cn(inputCls, "min-h-28 resize-y leading-relaxed")}
              />
            </Field>

            <Field label="Mood">
              <MoodSelector
                value={form.mood}
                onChange={(v) => setForm({ ...form, mood: v })}
              />
            </Field>

            <Field label="Tags">
              <TagsInput
                value={form.tags}
                onChange={(v) => setForm({ ...form, tags: v })}
              />
            </Field>

            <Field label="Cover Image URL (optional)" error={fieldErr("imageUrl")}>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className={inputCls}
              />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={close}
                className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-accent hover:text-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className={cn(
                  "rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white",
                  "shadow-[0_2px_8px_rgb(193_127_89/0.3)] transition-all duration-200",
                  "hover:bg-accent-dark disabled:opacity-60",
                )}
              >
                {pending ? "Saving…" : "Save Entry"}
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}

const inputCls = cn(
  "w-full rounded-md border border-line bg-surface px-3.5 py-2.5",
  "text-[0.95rem] text-ink outline-none transition-all duration-150",
  "focus:border-accent focus:shadow-[0_0_0_3px_rgb(193_127_89/0.15)]",
  "placeholder:text-ink-light",
);

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[0.82rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-[0.78rem] text-danger">{error}</p> : null}
    </div>
  );
}
