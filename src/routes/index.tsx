import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { topics } from "@/lib/topics";
import { useStats } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "indecisive — stop thinking, pick one" },
      { name: "description", content: "A tiny decision game for indecisive people. Answer either/or questions, grow a tree, get an answer, collect stickers." },
      { property: "og:title", content: "indecisive — stop thinking, pick one" },
      { property: "og:description", content: "Answer either/or questions, grow a decision tree, collect stickers." },
    ],
  }),
  component: Home,
});

function Home() {
  const s = useStats();
  const nav = useNavigate();
  const surprise = () => nav({ to: "/play/$topic", params: { topic: topics[Math.floor(Math.random() * topics.length)]?.id ?? "eat" } });
  return (
    <Shell>
      <section className="py-8">
        <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">Stop thinking.<br />Pick one.</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">Two choices at a time. Your tree grows until there's an answer.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={surprise} className="rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-[var(--shadow-chunk)] transition active:translate-y-1 active:shadow-none">🎲 Pick a topic for me</button>
          <span className="rounded-2xl bg-card px-4 py-3 font-semibold shadow-[var(--shadow-chunk)]">⚡ {s.xp} XP</span>
        </div>
      </section>
      <h2 className="mb-3 mt-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">Choose a dilemma</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((t) => (
          <Link key={t.id} to="/play/$topic" params={{ topic: t.id }}
            className="group flex items-center gap-4 rounded-3xl border-2 border-foreground bg-card p-5 shadow-[var(--shadow-chunk)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
            <span className="grid h-14 w-14 place-items-center rounded-2xl text-3xl" style={{ background: t.color }}>{t.emoji}</span>
            <span className="text-lg font-bold">{t.title}</span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
