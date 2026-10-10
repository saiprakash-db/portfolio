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

function stumpPose(time: number, delay: number, direction: number, angle: number) {
  const elapsed = Math.max(0, time - IMPACT_TIME - delay);
  const fall = 1 - Math.exp(-5.5 * elapsed);
  return {
    x: direction * 8 * fall,
    y: 2 * fall,
    rotation:
      angle * fall + 7 * Math.exp(-8 * elapsed) * Math.sin(24 * elapsed),
  };
}

export function CricketToy() {
  const clock = useToyClock(CRICKET_DURATION, true),
    id = useId().replace(/:/g, ""),
    copy = playfulUI.cricket;
  const pose = useTransform(clock.time, cricketPose);
  const x = useTransform(pose, (p) => p.x),
    y = useTransform(pose, (p) => p.y),
    rotate = useTransform(pose, (p) => p.rotation);
  const shadow = useTransform(y, (v) => 0.35 + (0.65 * v) / 180);
  const leftStump = useTransform(clock.time, (t) => stumpPose(t, 0, -1, -88));
  const middleStump = useTransform(clock.time, (t) =>
    stumpPose(t, 0.035, 1, 88),
  );
  const rightStump = useTransform(clock.time, (t) =>
    stumpPose(t, 0.07, 1, 110),
  );
  const leftStumpX = useTransform(leftStump, (p) => p.x),
    leftStumpY = useTransform(leftStump, (p) => p.y),
    leftStumpRotation = useTransform(leftStump, (p) => p.rotation);
  const middleStumpX = useTransform(middleStump, (p) => p.x),
    middleStumpY = useTransform(middleStump, (p) => p.y),
    middleStumpRotation = useTransform(middleStump, (p) => p.rotation);
  const rightStumpX = useTransform(rightStump, (p) => p.x),
    rightStumpY = useTransform(rightStump, (p) => p.y),
    rightStumpRotation = useTransform(rightStump, (p) => p.rotation);
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
            <motion.g
              style={{
                x: leftStumpX,
                y: leftStumpY,
                rotate: leftStumpRotation,
                originX: 0.5,
                originY: 1,
              }}
            >
              <path d="M-10 0v-74" className="toy-stumps" />
            </motion.g>
            <motion.g
              style={{
                x: middleStumpX,
                y: middleStumpY,
                rotate: middleStumpRotation,
                originX: 0.5,
                originY: 1,
              }}
            >
              <path d="M0 0v-74" className="toy-stumps" />
            </motion.g>
            <motion.g
              style={{
                x: rightStumpX,
                y: rightStumpY,
                rotate: rightStumpRotation,
                originX: 0.5,
                originY: 1,
              }}
            >
              <path d="M10 0v-74" className="toy-stumps" />
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
