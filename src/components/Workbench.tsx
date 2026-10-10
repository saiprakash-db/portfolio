import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { workbench } from "../data";
import { Icon } from "./ui";

export function Workbench() {
  const [active, setActive] = useState(1);
  const reduced = useReducedMotion();
  const stage = workbench.stages[active];
  return (
    <div className="workbench-shell">
      <div className="workbench">
        <div className="workbench-top">
          <span className="mono">{workbench.title}</span>
          <span className="workbench-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="architecture-art" aria-hidden="true">
          <svg viewBox="0 0 440 210" fill="none">
            <path
              d="M30 143 218 45 411 143 218 241Z"
              stroke="currentColor"
              opacity=".07"
            />
            <path
              d="m60 157 159-82 158 82M88 171l131-68 130 68"
              stroke="currentColor"
              opacity=".1"
            />
            <path
              d="M25 116h76l43 24M415 116h-76l-43 24"
              stroke="currentColor"
              opacity=".35"
              strokeDasharray="3 5"
            />
            <motion.g
              animate={{ y: reduced ? 0 : active === 0 ? 7 : 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 24 }}
            >
              <path
                d="m139 133 81-43 81 43v25l-81 43-81-43Z"
                fill="#1a3338"
                stroke="#538c91"
              />
              <path d="m139 133 81 44 81-44M220 177v24" stroke="#538c91" />
            </motion.g>
            <motion.g
              animate={{ y: reduced ? 0 : active === 1 ? -5 : 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 24 }}
            >
              <path
                d="m139 100 81-43 81 43v25l-81 43-81-43Z"
                fill="#21464b"
                stroke="#6bafb3"
              />
              <path d="m139 100 81 44 81-44M220 144v24" stroke="#6bafb3" />
            </motion.g>
            <motion.g
              animate={{ y: reduced ? 0 : active === 2 ? -12 : -3 }}
              transition={{ type: "spring", stiffness: 150, damping: 24 }}
            >
              <path
                d="m139 67 81-43 81 43v25l-81 43-81-43Z"
                fill="#244e53"
                stroke="#89c8c6"
              />
              <path d="m139 67 81 44 81-44M220 111v24" stroke="#89c8c6" />
              <path
                d="m194 64 19 10 34-18"
                stroke="#c7e5d8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </motion.g>
            <circle cx="42" cy="116" r="4" fill="#98c7bb" />
            <circle cx="399" cy="116" r="4" fill="#98c7bb" />
            <path
              d="M72 94v-8h8M360 86h8v8M72 145v8h8M360 153h8v-8"
              stroke="#98c7bb"
              opacity=".4"
            />
          </svg>
          <span className="architecture-coordinate mono">
            PYTHON / SQL / DATABRICKS
          </span>
        </div>
        <div
          className="workbench-tabs"
          role="tablist"
          aria-label="Explore the pipeline"
        >
          {workbench.stages.map((s, i) => (
            <button
              key={s.id}
              id={`stage-tab-${s.id}`}
              role="tab"
              aria-selected={active === i}
              aria-controls="stage-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (
                  ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const count = workbench.stages.length;
                  const next =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? count - 1
                        : (i + (e.key === "ArrowRight" ? 1 : count - 1)) %
                          count;
                  setActive(next);
                  document
                    .getElementById(`stage-tab-${workbench.stages[next].id}`)
                    ?.focus();
                }
              }}
            >
              <span className="mono">{s.number}</span>
              {s.label}
              {active === i && (
                <motion.span
                  className="tab-indicator"
                  layoutId="workbench-tab"
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <div
          id="stage-panel"
          className="workbench-panel"
          role="tabpanel"
          aria-labelledby={`stage-tab-${stage.id}`}
          tabIndex={0}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: reduced ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -4 }}
              transition={{ duration: 0.18 }}
            >
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <div className="workbench-rows">
                {stage.rows.map(([name, value]) => (
                  <div key={name}>
                    <span>
                      <i />
                      {name}
                    </span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="workbench-bottom">
          <span className="mono">{stage.footer}</span>
          <Icon name="check" size={15} />
        </div>
      </div>
      <div className="workbench-caption">
        <span className="caption-rule" />
        <span>{workbench.caption}</span>
      </div>
    </div>
  );
}
