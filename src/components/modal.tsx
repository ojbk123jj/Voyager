"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 拦截路由用的弹窗外壳。
 * 关闭即 router.back()，回到上一个 URL（通常是带筛选的列表）。
 */
export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    router.back();
  }, [router]);

  // ESC 关闭 + 锁定背景滚动
  useEffect(() => {
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
  }, [close]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) close();
      }}
      className={cn(
        "fixed inset-0 z-200 flex items-center justify-center p-4",
        "bg-ink/50 backdrop-blur-[6px]",
        "modal-overlay-in",
      )}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "relative max-h-[85vh] w-full max-w-[620px] overflow-y-auto",
          "rounded-modal bg-surface shadow-[0_24px_64px_rgb(30_27_24/0.12),0_8px_24px_rgb(30_27_24/0.06)]",
          "modal-panel-in",
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className={cn(
            "absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full",
            "bg-paper/90 backdrop-blur-md text-ink shadow-sm transition-all duration-200",
            "hover:bg-surface hover:shadow-md",
          )}
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
