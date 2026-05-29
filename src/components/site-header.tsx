"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Journal" },
  { href: "/collections", label: "Collections" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 px-8 border-b border-line",
        "bg-paper/85 backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-[1.75rem] font-medium tracking-wide text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-white">
            ✦
          </span>
          Voyager
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-display text-[1.05rem] tracking-wide transition-colors",
                  active
                    ? "font-medium text-accent"
                    : "text-ink-muted hover:text-accent",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5",
            "text-sm font-medium tracking-wide text-white",
            "shadow-[0_2px_8px_rgb(193_127_89/0.3)]",
            "transition-all duration-200",
            "hover:-translate-y-px hover:bg-accent-dark hover:shadow-[0_4px_16px_rgb(193_127_89/0.4)]",
          )}
        >
          <Plus className="size-4" strokeWidth={2.5} />
          New Entry
        </button>
      </div>
    </header>
  );
}
