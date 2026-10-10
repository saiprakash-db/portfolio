import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  buildPipelineRoute,
  pointOnRoute,
  type RouteSegment,
} from "../lib/pipeline";

function Segment({
  segment,
  progress,
  reduced,
}: {
  segment: RouteSegment;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const scaleX = useTransform(progress, [segment.start, segment.end], [0, 1], {
    clamp: true,
  });
  return (
    <g
      transform={`translate(${segment.from.x} ${segment.from.y}) rotate(${segment.angle})`}
    >
      <line x1="0" y1="0" x2={segment.length} y2="0" className="route-base" />
      <motion.line
        x1="0"
        y1="0"
        x2={segment.length}
        y2="0"
        className="route-fill"
        style={{ scaleX: reduced ? 1 : scaleX, originX: 0, originY: 0 }}
      />
    </g>
  );
}

export function Pipeline({ stages }: { stages: string[] }) {
  const list = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const [geometry, setGeometry] = useState({
    width: 0,
    height: 0,
    segments: [] as RouteSegment[],
  });
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 85%", "end 45%"],
  });
  useEffect(() => {
    const element = list.current;
    if (!element) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const nodes = Array.from(element.children).map((child) => {
        const item = child as HTMLElement;
        const dot = item.querySelector<HTMLElement>(".stage-dot")!;
        return {
          x: item.offsetLeft + dot.offsetLeft + dot.offsetWidth / 2,
          y: item.offsetTop + dot.offsetTop + dot.offsetHeight / 2,
          bottom: item.offsetTop + item.offsetHeight,
        };
      });
      setGeometry({
        width: element.clientWidth,
        height: element.clientHeight,
        segments: buildPipelineRoute(nodes, element.clientWidth).segments,
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    document.fonts.ready.then(measure);
    measure();
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [stages]);
  const x = useTransform(
    scrollYProgress,
    (p) => pointOnRoute(geometry.segments, p).x,
  );
  const y = useTransform(
    scrollYProgress,
    (p) => pointOnRoute(geometry.segments, p).y,
  );
  return (
    <div className="pipeline-track connected-pipeline">
      {geometry.width > 0 && (
        <svg
          className="pipeline-route"
          width={geometry.width}
          height={geometry.height}
          aria-hidden="true"
        >
          {geometry.segments.map((segment, i) => (
            <Segment
              key={`${geometry.width}-${geometry.height}-${i}`}
              segment={segment}
              progress={scrollYProgress}
              reduced={Boolean(reduced)}
            />
          ))}
          {!reduced && (
            <motion.circle r="3.5" className="route-packet" style={{ x, y }} />
          )}
        </svg>
      )}
      <ol ref={list} className="pipeline-stages">
        {stages.map((stage, i) => (
          <li key={stage}>
            <span className="stage-dot" aria-hidden="true" />
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
