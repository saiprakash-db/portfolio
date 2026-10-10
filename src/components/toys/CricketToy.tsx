import { useId } from "react";
import { motion, useTransform } from "framer-motion";
import { playfulUI } from "../../data";
import {
  bailPose,
  cricketPose,
  CRICKET_DURATION,
  IMPACT_TIME,
} from "../../lib/toy-physics";
import { useToyClock } from "./useToyClock";
export function CricketToy() {
  const clock = useToyClock(CRICKET_DURATION),
    id = useId().replace(/:/g, ""),
    copy = playfulUI.cricket;
  const pose = useTransform(clock.time, cricketPose);
  const x = useTransform(pose, (p) => p.x),
    y = useTransform(pose, (p) => p.y),
    rotate = useTransform(pose, (p) => p.rotation);
  const shadow = useTransform(y, (v) => 0.35 + (0.65 * v) / 180);
  const tilt = useTransform(clock.time, (t) => {
    const d = Math.max(0, t - IMPACT_TIME);
    return 7 * Math.exp(-5 * d) * Math.sin(23 * d);
  });
  const left = useTransform(clock.time, (t) => bailPose(t, false)),
    right = useTransform(clock.time, (t) => bailPose(t, true));
  const lx = useTransform(left, (p) => p.x),
    ly = useTransform(left, (p) => p.y),
    lr = useTransform(left, (p) => p.rotation);
  const rx = useTransform(right, (p) => p.x),
    ry = useTransform(right, (p) => p.y),
    rr = useTransform(right, (p) => p.rotation);
  return (
    <div className="cricket-toy toy-panel">
      <span className="eyebrow">{copy.label}</span>
      <h3>{copy.title}</h3>
      <button
        className="cricket-field"
        onClick={clock.play}
        disabled={clock.state === "playing"}
        aria-label={clock.state === "done" ? copy.replay : copy.action}
      >
        <svg viewBox="0 0 460 220" aria-hidden="true">
          <defs>
            <radialGradient id={id}>
              <stop stopColor="#c96a58" offset="0" />
              <stop stopColor="#81352e" offset=".7" />
              <stop stopColor="#572923" offset="1" />
            </radialGradient>
          </defs>
          <path d="M22 191H435" className="toy-ground" />
          <path
            d="M293 191l-15-23h116l-15 23M320 168v23"
            className="toy-pitch"
          />
          <text x="30" y="207" className="toy-svg-label">
            THE QUIET OVER
          </text>
          <g transform="translate(352 190)">
            <motion.g style={{ rotate: tilt, originX: 0.5, originY: 1 }}>
              <path d="M-10 0v-74M0 0v-74M10 0v-74" className="toy-stumps" />
            </motion.g>
          </g>
          <motion.g style={{ x: lx, y: ly, rotate: lr }}>
            <path d="M0 0h14" className="toy-bail" />
          </motion.g>
          <motion.g style={{ x: rx, y: ry, rotate: rr }}>
            <path d="M0 0h14" className="toy-bail" />
          </motion.g>
          <motion.g style={{ x, scaleX: shadow }}>
            <ellipse
              cy="192"
              rx="13"
              ry="2"
              fill="currentColor"
              opacity=".18"
            />
          </motion.g>
          <motion.g style={{ x, y, rotate }}>
            <circle r="10" fill={`url(#${id})`} />
            <path
              d="M-3-9Q4 0-3 9M0-9Q7 0 0 9"
              stroke="#f6dbb1"
              fill="none"
              strokeWidth=".8"
              strokeDasharray="1.5 1.5"
            />
          </motion.g>
        </svg>
      </button>
      <p className="toy-message" aria-live="polite">
        {clock.state === "done" ? copy.result : copy.hint}
      </p>
      <div className="toy-controls">
        <button
          className="toy-action"
          onClick={clock.play}
          disabled={clock.state === "playing"}
        >
          {clock.state === "playing"
            ? copy.playing
            : clock.state === "done"
              ? copy.replay
              : copy.action}
          <span aria-hidden="true">↗</span>
        </button>
        {clock.state !== "ready" && (
          <button className="toy-reset" onClick={clock.reset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
