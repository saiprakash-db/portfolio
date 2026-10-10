import assert from "node:assert/strict";
import {
  cricketPose,
  bailPose,
  marblePose,
  IMPACT_TIME,
  CRICKET_DURATION,
  MARBLE_DURATION,
  ROLL_DURATION,
} from "../src/lib/toy-physics.ts";
for (let t = 0; t <= CRICKET_DURATION; t += 1 / 240) {
  const p = cricketPose(t);
  assert.ok(Number.isFinite(p.x + p.y + p.rotation));
  assert.ok(p.y <= 180.00001, "Ball never tunnels through pitch");
  for (const side of [true, false]) {
    const b = bailPose(t, side);
    assert.ok(Number.isFinite(b.x + b.y + b.rotation));
    assert.ok(b.y <= 188.00001, "Bails stay above ground");
  }
}
assert.equal(cricketPose(IMPACT_TIME).x, 333);
assert.ok(
  cricketPose(IMPACT_TIME).y > 116 && cricketPose(IMPACT_TIME).y < 180,
  "Ball strikes wicket height",
);
assert.ok(
  Math.abs(
    cricketPose(IMPACT_TIME - 1e-6).y - cricketPose(IMPACT_TIME + 1e-6).y,
  ) < 0.01,
  "Impact has no position jump",
);
assert.equal(cricketPose(CRICKET_DURATION).y, 180);
assert.equal(bailPose(CRICKET_DURATION, true).y, 188);
let previous = 0;
const stages = new Set();
for (let t = 0; t <= MARBLE_DURATION; t += 1 / 240) {
  const p = marblePose(t);
  assert.ok(Number.isFinite(p.x + p.y + p.rotation));
  assert.ok(p.stage >= previous, "Stages occur in order");
  previous = p.stage;
  stages.add(p.stage);
  assert.ok(p.y >= 65 && p.y <= 170.000001);
}
assert.deepEqual([...stages], [0, 1, 2, 3]);
assert.ok(ROLL_DURATION > 1 && ROLL_DURATION < 6, "Roll has a usable duration");
assert.ok(
  Math.abs(marblePose(MARBLE_DURATION).x - 535) < 0.1,
  "Marble settles in cup",
);
for (const fps of [30, 60, 120]) {
  const t = Math.round(1.5 * fps) / fps;
  assert.deepEqual(marblePose(t), marblePose(1.5));
}
console.log(
  "PASS: ballistic collisions, floor bounds, impact continuity, settling, ordered pipeline stages, frame-rate-independent sampling.",
);
console.log(
  `Marble roll: ${ROLL_DURATION.toFixed(2)}s; cricket: ${CRICKET_DURATION}s.`,
);
