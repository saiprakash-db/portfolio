import { useEffect, useId, useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { playfulUI } from "../../data";
import { marblePose, MARBLE_DURATION, railPath } from "../../lib/toy-physics";
import { useToyClock } from "./useToyClock";
export function MarblePipeline() {
  const copy = playfulUI.marble,
    clock = useToyClock(MARBLE_DURATION);
  const id = useId().replace(/:/g, ""),
    svg = useRef<SVGSVGElement>(null);
  const x = useMotionValue(48),
    y = useMotionValue(48),
    rotate = useMotionValue(0);
  const [stage, setStage] = useState(0),
    [dragging, setDragging] = useState(false),
    [capturing, setCapturing] = useState(false),
    [radius, setRadius] = useState(24);
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null);
  const animations = useRef<ReturnType<typeof animate>[]>([]);
  const generation = useRef(0);
  const stageRef = useRef(0);
  const updateStage = (next: number) => {
    if (stageRef.current === next) return;
    stageRef.current = next;
    setStage(next);
  };
  const stop = () => {
    generation.current++;
    animations.current.forEach((a) => a.stop());
    animations.current = [];
  };
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) setRadius(Math.max(24, (24 * 600) / width));
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      generation.current++;
      animations.current.forEach((a) => a.stop());
    };
  }, []);
  useMotionValueEvent(clock.time, "change", (t) => {
    const p = marblePose(t);
    x.set(p.x);
    y.set(p.y);
    rotate.set(p.rotation);
    updateStage(p.stage);
  });
  const home = () => {
    stop();
    const previous = { x: x.get(), y: y.get(), rotation: rotate.get() };
    clock.reset();
    x.set(previous.x);
    y.set(previous.y);
    rotate.set(previous.rotation);
    drag.current = null;
    setDragging(false);
    setCapturing(false);
    updateStage(0);
    rotate.set(0);
    if (clock.reduced) {
      x.set(48);
      y.set(48);
      return;
    }
    animations.current = [
      animate(x, 48, { type: "spring", stiffness: 260, damping: 23 }),
      animate(y, 48, { type: "spring", stiffness: 260, damping: 23 }),
    ];
  };
  const launch = () => {
    stop();
    drag.current = null;
    setDragging(false);
    setCapturing(true);
    updateStage(0);
    rotate.set(0);
    const token = generation.current;
    if (clock.reduced) {
      clock.play();
      setCapturing(false);
      return;
    }
    const a = animate(x, 130, { type: "spring", stiffness: 240, damping: 26 }),
      b = animate(y, 65, { type: "spring", stiffness: 240, damping: 26 });
    animations.current = [a, b];
    Promise.all([a, b]).then(() => {
      if (generation.current !== token) return;
      setCapturing(false);
      clock.play();
    });
  };
  const point = (event: PointerEvent<SVGGElement>) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return { x: 48, y: 48 };
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
  };
  const busy = clock.state === "playing" || capturing;
  const down = (event: PointerEvent<SVGGElement>) => {
    if (busy || drag.current || event.button !== 0) return;
    event.preventDefault();
    stop();
    if (clock.state === "done") {
      const previous = { x: x.get(), y: y.get() };
      clock.reset();
      x.set(previous.x);
      y.set(previous.y);
      updateStage(0);
    }
    const p = point(event);
    drag.current = {
      id: event.pointerId,
      dx: p.x - x.get(),
      dy: p.y - y.get(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };
  const move = (event: PointerEvent<SVGGElement>) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    const p = point(event);
    x.set(Math.max(22, Math.min(578, p.x - d.dx)));
    y.set(Math.max(22, Math.min(238, p.y - d.dy)));
  };
  const up = (event: PointerEvent<SVGGElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (Math.hypot(x.get() - 130, y.get() - 55) < 48) launch();
    else home();
  };
  return (
    <div className="marble-toy toy-panel">
      <div className="marble-intro">
        <span className="eyebrow">{copy.label}</span>
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
        <div className="toy-controls">
          <button className="toy-action" onClick={launch} disabled={busy}>
            {busy
              ? copy.playing
              : clock.state === "done"
                ? copy.replay
                : copy.action}
            <span aria-hidden="true">↗</span>
          </button>
          <button className="toy-reset" onClick={home}>
            Reset
          </button>
        </div>
      </div>
      <div className="marble-playground">
        <svg
          ref={svg}
          viewBox="0 0 600 286"
          className="marble-scene"
          aria-label="An interactive marble track: validate, transform, serve"
        >
          <defs>
            <radialGradient id={id} cx="30%" cy="25%">
              <stop offset="0" stopColor="#b2eeee" />
              <stop offset=".45" stopColor="#3a9ca5" />
              <stop offset="1" stopColor="#15515d" />
            </radialGradient>
          </defs>
          <g aria-hidden="true">
            <path d="M28 70h40" className="marble-tray" />
            <circle
              cx="130"
              cy="55"
              r="30"
              className={`marble-inlet ${dragging ? "is-waiting" : ""}`}
            />
            <text x="130" y="14" textAnchor="middle" className="toy-svg-label">
              INLET ↓
            </text>
            <path
              d="M220 145v65M365 190v20M535 190v20M202 211h36M347 211h36M517 211h36"
              className="toy-pitch"
            />
            <path
              d={railPath}
              transform="translate(0 18)"
              className="marble-rail"
            />
            <path
              d="M510 186v12q0 7 8 7h27q8 0 8-8v-45"
              className="marble-cup"
            />
            {copy.stages.map((s, i) => (
              <g key={s}>
                <circle
                  cx={[220, 365, 535][i]}
                  cy="237"
                  r="4"
                  className={stage > i ? "stage-dot is-complete" : "stage-dot"}
                />
                <text
                  x={[220, 365, 535][i]}
                  y="273"
                  textAnchor="middle"
                  className="toy-svg-label"
                >
                  {s}
                </text>
              </g>
            ))}
          </g>
          <motion.g
            style={{ x, y, rotate }}
            className={`marble-handle ${dragging ? "is-dragging" : ""}`}
            role="button"
            tabIndex={busy ? -1 : 0}
            aria-disabled={busy}
            aria-label="Data marble. Drag to the inlet or press Enter to launch."
            onKeyDown={(e) => {
              if (e.key === "Escape" && drag.current) {
                e.preventDefault();
                const pointer = drag.current.id;
                home();
                if (e.currentTarget.hasPointerCapture(pointer))
                  e.currentTarget.releasePointerCapture(pointer);
                return;
              }
              if ((e.key === "Enter" || e.key === " ") && !busy) {
                e.preventDefault();
                launch();
              }
            }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={() => {
              if (drag.current) home();
            }}
            onLostPointerCapture={() => {
              if (drag.current) home();
            }}
          >
            <circle r={radius} fill="transparent" />
            <circle r="22" className="marble-focus" />
            <circle r="18" fill={`url(#${id})`} />
            <path
              d="M-9-5q2-6 8-6"
              stroke="#e0ffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity=".6"
              fill="none"
            />
            <circle cx="-4" cy="3" r="1.5" fill="#e0ffff" />
            <circle cx="3" cy="3" r="1.5" fill="#e0ffff" />
            <circle cx="3" cy="9" r="1.5" fill="#e0ffff" />
          </motion.g>
        </svg>
        <p className="toy-message" aria-live="polite">
          <span
            className={clock.state === "done" ? "toy-complete" : ""}
            aria-hidden="true"
          >
            {clock.state === "done" ? "✓" : "↳"}
          </span>{" "}
          {clock.state === "done" ? copy.complete : copy.ready}
        </p>
      </div>
    </div>
  );
}
