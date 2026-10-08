import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useStats } from "@/lib/store";

export function Logo({ className = "" }: { className?: string }) {
  return <span className={`tracking-tight ${className}`}><b className="font-extrabold">in</b><span className="font-normal">decisive</span></span>;
}

export function Shell({ children }: { children: ReactNode }) {
  const s = useStats();
  const nav = "rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground";
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <Link to="/"><Logo className="text-2xl text-foreground" /></Link>
        <nav className="flex items-center gap-1">
          <Link to="/stickers" className={nav} activeProps={{ className: "text-foreground" }}>Stickers</Link>
          <Link to="/stats" className={nav} activeProps={{ className: "text-foreground" }}>Stats</Link>
          <span className="ml-2 rounded-full bg-card px-3 py-1.5 text-sm font-bold shadow-[var(--shadow-chunk)]">🔥 {s.streak}</span>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-16">{children}</main>
    </div>
  );
}
