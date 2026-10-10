export const CRICKET_DURATION = 3.6;
export const IMPACT_TIME = 1.18;
const gravity = 760;
const bounceTime = (95 + Math.sqrt(95 ** 2 + 2 * gravity * 66)) / gravity;

/** Analytic ballistic arcs; collisions happen at the floor, independent of frame rate. */
export function bounce(
  y: number,
  vy: number,
  time: number,
  floor: number,
  g: number,
  restitution: number,
) {
  let remaining = Math.max(0, time);
  for (let i = 0; i < 18; i++) {
    const hit = (-vy + Math.sqrt(vy * vy + 2 * g * Math.max(0, floor - y))) / g;
    if (remaining <= hit) return y + vy * remaining + 0.5 * g * remaining ** 2;
    remaining -= hit;
    vy = -(vy + g * hit) * restitution;
    y = floor;
    if (Math.abs(vy) < 2) return floor;
  }
  return floor;
}
function incoming(t: number) {
  return t <= bounceTime
    ? 114 - 95 * t + (gravity * t * t) / 2
    : bounce(
        180,
        -(gravity * bounceTime - 95) * 0.58,
        t - bounceTime,
        180,
        gravity,
        0.58,
      );
}
export function cricketPose(time: number) {
  const t = Math.max(0, time);
  if (t <= IMPACT_TIME)
    return { x: 38 + 250 * t, y: incoming(t), rotation: t * 660 };
  const d = t - IMPACT_TIME;
  return {
    x: 333 - 36 * (1 - Math.exp(-2.1 * d)),
    y: bounce(incoming(IMPACT_TIME), -110, d, 180, gravity, 0.32),
    rotation: IMPACT_TIME * 660 - 180 * (1 - Math.exp(-2 * d)),
  };
}
export function bailPose(time: number, right: boolean) {
  const d = Math.max(0, time - IMPACT_TIME);
  return {
    x: (right ? 352 : 337) + (right ? 83 : -58) * (1 - Math.exp(-1.7 * d)),
    y: bounce(113, right ? -135 : -170, d, 188, 600, 0.24),
    rotation: (right ? 240 : -210) * (1 - Math.exp(-2 * d)),
  };
}
export const railPath =
  "M130 65 C130 120 170 125 220 125 L290 125 C325 125 325 170 365 170 L535 170";
type Point = { x: number; y: number; distance: number };
const points: Point[] = [{ x: 130, y: 65, distance: 0 }];
function add(x: number, y: number) {
  const p = points[points.length - 1];
  points.push({ x, y, distance: p.distance + Math.hypot(x - p.x, y - p.y) });
}
function curve(a: number[], b: number[], c: number[], d: number[]) {
  for (let i = 1; i <= 100; i++) {
    const t = i / 100,
      u = 1 - t;
    add(
      u ** 3 * a[0] +
        3 * u * u * t * b[0] +
        3 * u * t * t * c[0] +
        t ** 3 * d[0],
      u ** 3 * a[1] +
        3 * u * u * t * b[1] +
        3 * u * t * t * c[1] +
        t ** 3 * d[1],
    );
  }
}
curve([130, 65], [130, 120], [170, 125], [220, 125]);
for (let x = 221; x <= 290; x++) add(x, 125);
curve([290, 125], [325, 125], [325, 170], [365, 170]);
for (let x = 366; x <= 535; x++) add(x, 170);
export const railLength = points[points.length - 1].distance;
function atDistance(distance: number) {
  const s = Math.max(0, Math.min(railLength, distance));
  let lo = 0,
    hi = points.length - 1;
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid].distance < s) lo = mid;
    else hi = mid;
  }
  const a = points[lo],
    b = points[hi],
    f = (s - a.distance) / (b.distance - a.distance);
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    slope: (b.y - a.y) / (b.distance - a.distance),
  };
}
const frames = [0];
let speed = 20,
  distance = 0;
// Rolling solid sphere: 5/7 of the gravitational acceleration along the rail.
while (distance < railLength && frames.length < 2400) {
  const p = atDistance(distance);
  speed = Math.max(12, speed + ((450 * p.slope * 5) / 7 - 5) / 120);
  distance = Math.min(railLength, distance + speed / 120);
  frames.push(distance);
}
export const ROLL_DURATION = (frames.length - 1) / 120;
export const MARBLE_DURATION = ROLL_DURATION + 0.8;
export function marblePose(time: number) {
  const f = Math.max(0, time) * 120,
    i = Math.min(frames.length - 1, Math.floor(f));
  const s = frames[i] + ((frames[i + 1] ?? frames[i]) - frames[i]) * (f - i);
  const p = atDistance(s),
    d = Math.max(0, time - ROLL_DURATION);
  return {
    x: p.x - (d ? 6 * Math.exp(-6 * d) * Math.abs(Math.sin(16 * d)) : 0),
    y: p.y,
    rotation: ((s / 18) * 180) / Math.PI,
    stage: p.x >= 534 ? 3 : p.x >= 365 ? 2 : p.x >= 220 ? 1 : 0,
  };
}
