import { describe, expect, it } from "vitest";
import { isLeaf, topics, type Node } from "./topics";

function collectLeaves(node: Node, depth = 0): Array<{ result: string; depth: number }> {
  if (isLeaf(node)) return [{ result: node.result, depth }];
  return [
    ...collectLeaves(node.a[1], depth + 1),
    ...collectLeaves(node.b[1], depth + 1),
  ];
}

describe("decision topics", () => {
  it("provides at least ten topics with sixteen distinct, four-step outcomes each", () => {
    expect(topics.length).toBeGreaterThanOrEqual(10);
    expect(new Set(topics.map((topic) => topic.id)).size).toBe(topics.length);

    for (const topic of topics) {
      const leaves = collectLeaves(topic.tree);
      expect(leaves, topic.id).toHaveLength(16);
      expect(new Set(leaves.map((leaf) => leaf.result)).size, topic.id).toBe(16);
      expect(leaves.every((leaf) => leaf.depth === 4), topic.id).toBe(true);
    }
  });
});
