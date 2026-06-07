"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  const params = useSearchParams();

  // 在当前路径上叠加 ?new=1 打开新建面板，保留已有查询参数
  const newEntryHref = (() => {
    const next = new URLSearchParams(params.toString());
    next.set("new", "1");
    return `${pathname}?${next.toString()}`;
  })();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 px-4 sm:px-8 border-b border-line",
        "bg-paper/85 backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-[1.4rem] sm:text-[1.75rem] font-medium tracking-wide text-ink"
        >
          <span className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-accent text-sm text-white">
            ✦
          </span>
          Voyager
        </Link>

        {/* Nav (桌面) */}
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* CTA */}
        <Link
          href={newEntryHref}
          scroll={false}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 sm:px-5 sm:py-2.5",
            "text-sm font-medium tracking-wide text-white",
            "shadow-[0_2px_8px_rgb(193_127_89/0.3)]",
            "transition-all duration-200",
            "hover:-translate-y-px hover:bg-accent-dark hover:shadow-[0_4px_16px_rgb(193_127_89/0.4)]",
          )}
        >
          <Plus className="size-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">New Entry</span>
        </Link>
      </div>

      {/* Nav (移动端：第二行) */}
      <nav className="flex items-center justify-center gap-6 pb-2 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            pathname={pathname}
            className="text-[0.95rem]"
          />
        ))}
      </nav>
    </header>
  );
}

function NavLink({
  href,
  label,
  pathname,
  className,
}: {
  href: string;
  label: string;
  pathname: string;
  className?: string;
}) {
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "font-display text-[1.05rem] tracking-wide transition-colors",
        active ? "font-medium text-accent" : "text-ink-muted hover:text-accent",
        className,
      )}
    >
      {label}
    </Link>
  );
}
