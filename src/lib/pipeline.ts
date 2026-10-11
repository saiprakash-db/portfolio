export type Point = { x: number; y: number };
export type StagePoint = Point & { bottom: number };
export type RouteSegment = {
  from: Point;
  to: Point;
  length: number;
  start: number;
  end: number;
  angle: number;
};
export function buildPipelineRoute(nodes: StagePoint[], width: number) {
  const points: Point[] = [];
  const stagePointIndexes: number[] = [];
  let rowBottom = 0;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (i && node.y > nodes[i - 1].y + 2) {
      const previous = nodes[i - 1];
      const gutterY = (rowBottom + node.y) / 2;
      points.push(
        { x: width + 8, y: previous.y },
        { x: width + 8, y: gutterY },
        { x: -8, y: gutterY },
        { x: -8, y: node.y },
      );
      rowBottom = 0;
    }
    stagePointIndexes.push(points.length);
    points.push({ x: node.x, y: node.y });
    rowBottom = Math.max(rowBottom, node.bottom);
  }
  const raw = points
    .slice(1)
    .map((to, i) => ({
      from: points[i],
      to,
      length: Math.hypot(to.x - points[i].x, to.y - points[i].y),
    }))
    .filter((s) => s.length > 0);
  const total = raw.reduce((sum, s) => sum + s.length, 0);
  const cumulative = [0];
  raw.forEach((segment) => cumulative.push(cumulative[cumulative.length - 1] + segment.length));
  let distance = 0;
  const segments: RouteSegment[] = raw.map((s) => {
    const start = distance / total;
    distance += s.length;
    return {
      ...s,
      start,
      end: distance / total,
      angle: (Math.atan2(s.to.y - s.from.y, s.to.x - s.from.x) * 180) / Math.PI,
    };
  });
  const stageProgress = stagePointIndexes.map((index) =>
    total ? cumulative[index] / total : 0,
  );
  return { points, segments, stageProgress, total };
}
export function pointOnRoute(
  segments: RouteSegment[],
  progress: number,
): Point {
  if (!segments.length) return { x: 0, y: 0 };
  const p = Math.max(0, Math.min(1, progress));
  const segment =
    segments.find((s) => p <= s.end) ?? segments[segments.length - 1];
  const t = Math.max(
    0,
    Math.min(1, (p - segment.start) / (segment.end - segment.start)),
  );
  return {
    x: segment.from.x + (segment.to.x - segment.from.x) * t,
    y: segment.from.y + (segment.to.y - segment.from.y) * t,
  };
}
