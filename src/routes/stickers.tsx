import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { stickers, useStats } from "@/lib/store";

export const Route = createFileRoute("/stickers")({
  head: () => ({ meta: [
    { title: "Sticker book — indecisive" }, { name: "description", content: "Every sticker you've earned by making decisions." },
    { property: "og:title", content: "Sticker book — indecisive" }, { property: "og:description", content: "Collect stickers by making decisions." },
  ] }),
  component: Stickers,
});

function Stickers() {
  const s = useStats();
  return (
    <Shell>
      <h1 className="text-4xl font-extrabold">Sticker book</h1>
      <p className="mt-1 text-muted-foreground">{s.stickers.length} / {stickers.length} collected</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stickers.map((st, i) => {
          const has = s.stickers.includes(st.id);
          return (
            <div key={st.id} className={`rounded-3xl border-2 p-5 text-center ${has ? "border-foreground bg-card shadow-[var(--shadow-chunk)]" : "border-dashed border-border"}`} style={has ? { transform: `rotate(${(i % 3) - 1}deg)` } : undefined}>
              <div className={`text-5xl ${has ? "" : "opacity-20 grayscale"}`}>{has ? st.emoji : "?"}</div>
              <p className="mt-2 font-bold">{has ? st.name : "Locked"}</p>
              <p className="text-xs text-muted-foreground">{st.hint}</p>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
