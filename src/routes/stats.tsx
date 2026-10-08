import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useStats } from "@/lib/store";
import { getTopic } from "@/lib/topics";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [
    { title: "Your stats — indecisive" }, { name: "description", content: "Decisions made, times you let fate decide, longest paths and streaks." },
    { property: "og:title", content: "Your stats — indecisive" }, { property: "og:description", content: "See how decisive you've become." },
  ] }),
  component: StatsPage,
});

function StatsPage() {
  const s = useStats();
  const fav = Object.entries(s.byTopic).sort((a, b) => b[1] - a[1])[0];
  const items = [
    ["✅", "Decisions made", s.accepted],
    ["🎲", "Times the game decided", s.gameDecided],
    ["🔁", "Rerolls", s.rerolls],
    ["🌳", "Longest decision path", `${s.longestPath} steps`],
    ["🔥", "Current streak", `${s.streak} days`],
    ["🏆", "Longest streak", `${s.bestStreak} days`],
    ["⚡", "Total XP", s.xp],
    ["❤️", "Favourite dilemma", fav ? getTopic(fav[0])?.title ?? "—" : "—"],
  ] as const;
  return (
    <Shell>
      <h1 className="text-4xl font-extrabold">Your stats</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map(([e, label, v]) => (
          <div key={label} className="rounded-3xl border-2 border-foreground bg-card p-5 shadow-[var(--shadow-chunk)]">
            <p className="text-sm font-semibold text-muted-foreground">{e} {label}</p>
            <p className="mt-1 text-3xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
