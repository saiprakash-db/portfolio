import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
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
}: {
  segment: RouteSegment;
  progress: MotionValue<number>;
}) {
  const fill = useTransform(progress, [segment.start, segment.end], [0, 1], {
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
        style={{ pathLength: fill }}
      />
    </g>
  );
}

export function Pipeline({ stages }: { stages: string[] }) {
  const list = useRef<HTMLOListElement>(null);
  const [geometry, setGeometry] = useState({
    width: 0,
    height: 0,
    segments: [] as RouteSegment[],
    stageProgress: [] as number[],
  });
  const [passedStages, setPassedStages] = useState(0);
  const { scrollYProgress: progress } = useScroll({
    target: list,
    offset: ["start 90%", "end 10%"],
  });
  useMotionValueEvent(progress, "change", (value) => {
    const count = geometry.stageProgress.filter((stage) => value >= stage).length;
    setPassedStages((current) => (current === count ? current : count));
  });
  useEffect(() => {
    const count = geometry.stageProgress.filter((stage) => progress.get() >= stage).length;
    setPassedStages(count);
  }, [geometry.stageProgress, progress]);
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
      const route = buildPipelineRoute(nodes, element.clientWidth);
      setGeometry({
        width: element.clientWidth,
        height: element.clientHeight,
        segments: route.segments,
        stageProgress: route.stageProgress,
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
    progress,
    (p) => pointOnRoute(geometry.segments, p).x,
  );
  const y = useTransform(
    progress,
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
              progress={progress}
            />
          ))}
          <motion.circle r="3.5" className="route-packet" style={{ x, y }} />
        </svg>
      )}
      <ol ref={list} className="pipeline-stages">
        {stages.map((stage, i) => (
          <li key={stage}>
            <span
              className={`stage-dot${i < passedStages ? " is-passed" : ""}`}
              aria-hidden="true"
            />
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
