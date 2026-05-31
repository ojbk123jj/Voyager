"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteEntry } from "@/app/actions";

export function EntryActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onEdit() {
    // 打开编辑面板：跳到首页并带上 ?edit=id（面板是全局的）
    router.push(`/?edit=${id}`, { scroll: false });
  }

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteEntry(id);
    });
  }

  return (
    <div className="mt-6 flex gap-3">
      <button
        type="button"
        onClick={onEdit}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-line px-3.5 py-2",
          "text-[0.82rem] font-medium text-ink-muted transition-colors",
          "hover:border-accent hover:text-accent hover:bg-accent/10",
        )}
      >
        <Pencil className="size-3.5" /> Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-3.5 py-2",
          "text-[0.82rem] font-medium transition-colors disabled:opacity-60",
          confirming
            ? "border-danger bg-danger text-white"
            : "border-[#E8C8C5] text-danger hover:bg-[#FDF2F1] hover:border-danger",
        )}
        onBlur={() => setConfirming(false)}
      >
        <Trash2 className="size-3.5" />
        {pending ? "Deleting…" : confirming ? "Confirm delete?" : "Delete"}
      </button>
    </div>
  );
}
