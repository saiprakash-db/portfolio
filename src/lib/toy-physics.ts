const FLIGHT_DURATION = 1.3;
const LANDING_X = 230;
const WICKET_X = 333;
const BALL_GRAVITY = 350;
const FLIGHT_VX = (LANDING_X - 38) / FLIGHT_DURATION;
const FLIGHT_VY =
  (180 - 114 - 0.5 * BALL_GRAVITY * FLIGHT_DURATION ** 2) /
  FLIGHT_DURATION;
const BOUNCE_VY = -220;
const BOUNCE_GRAVITY = 450;
const BOUNCE_DURATION = (WICKET_X - LANDING_X) / FLIGHT_VX;
const IMPACT_Y =
  180 + BOUNCE_VY * BOUNCE_DURATION +
  0.5 * BOUNCE_GRAVITY * BOUNCE_DURATION ** 2;
const CRICKET_ROLL_DURATION = BOUNCE_DURATION;
export const IMPACT_TIME = FLIGHT_DURATION + CRICKET_ROLL_DURATION;
export const CRICKET_DURATION = IMPACT_TIME + 1.5;

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
  return 114 + FLIGHT_VY * t + (BALL_GRAVITY * t * t) / 2;
}
export function cricketPose(time: number) {
  const t = Math.max(0, time);
  if (t <= FLIGHT_DURATION)
    return {
      x: 38 + FLIGHT_VX * t,
      y: incoming(t),
      rotation: t * 360,
    };
  const rollTime = Math.min(t - FLIGHT_DURATION, CRICKET_ROLL_DURATION);
  const x = LANDING_X + FLIGHT_VX * rollTime;
  const rollRotation = ((x - LANDING_X) / 10) * (180 / Math.PI);
  if (t <= IMPACT_TIME)
    return {
      x,
      y: bounce(180, BOUNCE_VY, rollTime, 180, BOUNCE_GRAVITY, 0.25),
      rotation: FLIGHT_DURATION * 360 + rollRotation,
    };
  const d = t - IMPACT_TIME;
  return {
    x: WICKET_X + 38 * (1 - Math.exp(-3 * d)),
    y: bounce(IMPACT_Y, -85, d, 180, 420, 0.22),
    rotation: FLIGHT_DURATION * 360 + rollRotation + 180 * d,
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
  "M130 65 C130 120 170 125 220 125 L290 125 C325 125 325 170 365 170 L510 170";
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
for (let x = 366; x <= 510; x++) add(x, 170);
curve([510, 170], [522, 170], [535, 170], [535, 185]);
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
// A lighter gravity and rolling resistance keep the marble's journey deliberate.
while (distance < railLength && frames.length < 2400) {
  const p = atDistance(distance);
  speed = Math.max(60, speed + ((39 * p.slope * 5) / 7 - 4.3) / 120);
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
    y: p.y + (d ? 2.5 * Math.exp(-7 * d) * Math.abs(Math.sin(13 * d)) : 0),
    rotation: ((s / 18) * 180) / Math.PI,
    stage: p.x >= 534 ? 3 : p.x >= 365 ? 2 : p.x >= 220 ? 1 : 0,
  };
}
