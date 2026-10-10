import assert from "node:assert/strict";
import { buildPipelineRoute, pointOnRoute } from "../src/lib/pipeline.ts";
for (const columns of [2, 3, 6]) {
  for (const count of [6, 12]) {
    const width = columns * 150;
    const nodes = Array.from({ length: count }, (_, i) => ({
      x: (i % columns) * 150 + 5,
      y: Math.floor(i / columns) * 125 + 5,
      bottom: Math.floor(i / columns) * 125 + 85,
    }));
    const route = buildPipelineRoute(nodes, width);
    let last = -1;
    for (const node of nodes) {
      const index = route.points.findIndex(
        (p) => p.x === node.x && p.y === node.y,
      );
      assert.ok(index > last, "All stages must occur in reading order");
      last = index;
    }
    assert.deepEqual(pointOnRoute(route.segments, 0), {
      x: nodes[0].x,
      y: nodes[0].y,
    });
    const end = nodes.at(-1);
    assert.deepEqual(pointOnRoute(route.segments, 1), { x: end.x, y: end.y });
    for (const segment of route.segments) {
      assert.ok(segment.length > 0);
      assert.ok(segment.end > segment.start);
      // Horizontal return connectors must run in row gaps, never through labels.
      if (segment.to.x < segment.from.x) {
        const row = Math.floor(segment.from.y / 125);
        assert.ok(
          segment.from.y > row * 125 + 85 &&
            segment.from.y < (row + 1) * 125 + 5,
        );
      }
    }
    console.log(
      `PASS: ${count} stages / ${columns} columns, full route and final-stage endpoint`,
    );
  }
}
assert.deepEqual(pointOnRoute([], 0), { x: 0, y: 0 });
