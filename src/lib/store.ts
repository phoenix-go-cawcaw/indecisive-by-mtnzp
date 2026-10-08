import { useEffect, useState } from "react";
import { topics } from "./topics";

export type Stats = {
  xp: number; streak: number; bestStreak: number; lastDay: string | null;
  decisions: number; accepted: number; gameDecided: number; rerolls: number;
  longestPath: number; byTopic: Record<string, number>; stickers: string[];
};
const KEY = "indecisive-v1";
const empty: Stats = { xp: 0, streak: 0, bestStreak: 0, lastDay: null, decisions: 0, accepted: 0, gameDecided: 0, rerolls: 0, longestPath: 0, byTopic: {}, stickers: [] };

export type Sticker = { id: string; emoji: string; name: string; hint: string };
export const stickers: Sticker[] = [
  ...topics.map((t) => ({ id: `topic-${t.id}`, emoji: t.emoji, name: t.title, hint: `Finish "${t.title}"` })),
  { id: "first", emoji: "⭐", name: "First pick", hint: "Make your first decision" },
  { id: "ten", emoji: "🏅", name: "Decider", hint: "Make 10 decisions" },
  { id: "coin", emoji: "🪙", name: "Fate's friend", hint: "Let the game decide 5 times" },
  { id: "streak3", emoji: "🔥", name: "On fire", hint: "Reach a 3-day streak" },
  { id: "streak7", emoji: "🌈", name: "Week of yes", hint: "Reach a 7-day streak" },
];

const read = (): Stats => { try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return empty; } };
const listeners = new Set<() => void>();
const write = (s: Stats) => { localStorage.setItem(KEY, JSON.stringify(s)); listeners.forEach((l) => l()); };

export function useStats() {
  const [s, set] = useState<Stats>(empty);
  useEffect(() => { const l = () => set(read()); l(); listeners.add(l); return () => { listeners.delete(l); }; }, []);
  return s;
}

const day = (d = new Date()) => d.toISOString().slice(0, 10);

export function recordReroll() { const s = read(); write({ ...s, rerolls: s.rerolls + 1 }); }

/** Records an accepted decision; returns newly unlocked stickers. */
export function recordDecision(topicId: string, pathLength: number, randomPicks: number): Sticker[] {
  const s = read();
  const today = day();
  const yesterday = day(new Date(Date.now() - 864e5));
  const streak = s.lastDay === today ? s.streak : s.lastDay === yesterday ? s.streak + 1 : 1;
  const n: Stats = {
    ...s, xp: s.xp + 10 + pathLength * 2, streak, bestStreak: Math.max(s.bestStreak, streak), lastDay: today,
    decisions: s.decisions + 1, accepted: s.accepted + 1, gameDecided: s.gameDecided + randomPicks,
    longestPath: Math.max(s.longestPath, pathLength), byTopic: { ...s.byTopic, [topicId]: (s.byTopic[topicId] || 0) + 1 },
  };
  const earn = new Set(n.stickers);
  earn.add(`topic-${topicId}`); earn.add("first");
  if (n.decisions >= 10) earn.add("ten");
  if (n.gameDecided >= 5) earn.add("coin");
  if (n.streak >= 3) earn.add("streak3");
  if (n.streak >= 7) earn.add("streak7");
  const fresh = [...earn].filter((id) => !s.stickers.includes(id));
  n.stickers = [...earn];
  write(n);
  return stickers.filter((x) => fresh.includes(x.id));
}
