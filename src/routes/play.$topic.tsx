import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { getTopic, isLeaf, type Node } from "@/lib/topics";
import { recordDecision, recordReroll, type Sticker } from "@/lib/store";

export const Route = createFileRoute("/play/$topic")({
  loader: ({ params }) => { const t = getTopic(params.topic); if (!t) throw notFound(); return { title: t.title }; },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — indecisive` : "Not found — indecisive";
    return { meta: [
      { title }, { name: "description", content: "Answer quick either/or questions and let your decision tree grow." },
      { property: "og:title", content: title }, { property: "og:description", content: "Grow a decision tree and get an answer." },
    ] };
  },
  notFoundComponent: () => <Shell><p className="py-10 text-center">That dilemma doesn't exist. <Link to="/" className="font-bold underline">Go home</Link></p></Shell>,
  component: Play,
});

type Step = { q: string; options: [string, string]; picked: 0 | 1; random: boolean };

function Play() {
  const { topic } = Route.useParams();
  const t = getTopic(topic)!;
  const [steps, setSteps] = useState<Step[]>([]);
  const [node, setNode] = useState<Node>(t.tree);
  const [claimed, setClaimed] = useState<Sticker[] | null>(null);

  const choose = (i: 0 | 1, random = false) => {
    if (isLeaf(node)) return;
    const [, nextA] = node.a; const [, nextB] = node.b;
    setSteps((s) => [...s, { q: node.q, options: [node.a[0], node.b[0]], picked: i, random }]);
    setNode(i === 0 ? nextA : nextB);
  };
  const reset = () => { setSteps([]); setNode(t.tree); setClaimed(null); };

  return (
    <Shell>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl text-2xl" style={{ background: t.color }}>{t.emoji}</span>
        <h1 className="text-2xl font-extrabold">{t.title}</h1>
      </div>

      <div className="flex flex-col items-center">
        {steps.map((s, i) => (
          <div key={i} className="flex w-full max-w-md flex-col items-center animate-in fade-in zoom-in-95">
            <p className="mb-2 text-sm font-semibold text-muted-foreground">{s.q}</p>
            <div className="grid w-full grid-cols-2 gap-3">
              {s.options.map((o, j) => (
                <div key={j} className={`rounded-2xl border-2 px-3 py-2 text-center font-bold transition ${j === s.picked ? "border-foreground bg-card shadow-[var(--shadow-chunk)]" : "border-dashed border-border text-muted-foreground opacity-40"}`}>
                  {o}{j === s.picked && s.random && " 🎲"}
                </div>
              ))}
            </div>
            <div className={`h-8 w-1 rounded-full bg-foreground ${s.picked === 0 ? "-translate-x-[6.5rem] sm:-translate-x-28" : "translate-x-[6.5rem] sm:translate-x-28"}`} />
          </div>
        ))}

        {!isLeaf(node) ? (
          <div key={steps.length} className="w-full max-w-md rounded-3xl border-2 border-foreground bg-card p-6 text-center shadow-[var(--shadow-chunk)] animate-in fade-in slide-in-from-top-2">
            <h2 className="text-2xl font-extrabold">{node.q}</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {([0, 1] as const).map((i) => (
                <button key={i} onClick={() => choose(i)} className="rounded-2xl px-4 py-4 text-lg font-bold shadow-[var(--shadow-chunk)] transition active:translate-y-1 active:shadow-none" style={{ background: i === 0 ? "var(--sticker-1)" : "var(--sticker-2)" }}>
                  {i === 0 ? node.a[0] : node.b[0]}
                </button>
              ))}
            </div>
            <button onClick={() => choose(Math.random() < 0.5 ? 0 : 1, true)} className="mt-4 text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground">I can't decide 🎲</button>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-3xl border-2 border-foreground bg-card p-8 text-center shadow-[var(--shadow-chunk)] animate-in zoom-in-90">
            <div className="text-7xl">{node.emoji}</div>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">The answer is</p>
            <h2 className="text-3xl font-extrabold">{node.result}</h2>
            <p className="mt-2 text-muted-foreground">{node.why}</p>
            {claimed ? (
              <div className="mt-6 space-y-3">
                <p className="font-bold">+{10 + steps.length * 2} XP. Go do it!</p>
                {claimed.map((c) => <p key={c.id} className="rounded-2xl bg-accent px-3 py-2 font-semibold text-accent-foreground">New sticker: {c.emoji} {c.name}</p>)}
                <div className="flex justify-center gap-3 pt-2">
                  <button onClick={reset} className="rounded-2xl border-2 border-foreground px-4 py-2 font-bold">Again</button>
                  <Link to="/" className="rounded-2xl bg-primary px-4 py-2 font-bold text-primary-foreground">Home</Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => { recordReroll(); reset(); }} className="rounded-2xl border-2 border-foreground px-4 py-3 font-bold">Reroll</button>
                <button onClick={() => setClaimed(recordDecision(t.id, steps.length, steps.filter((s) => s.random).length))} className="rounded-2xl bg-primary px-4 py-3 font-bold text-primary-foreground shadow-[var(--shadow-chunk)]">Do it ✓</button>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}
