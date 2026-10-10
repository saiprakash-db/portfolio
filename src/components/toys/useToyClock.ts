import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion } from "framer-motion";
export function useToyClock(duration: number, forceAnimation = false) {
  const time = useMotionValue(0),
    prefersReducedMotion = useReducedMotion(),
    reduced = Boolean(prefersReducedMotion && !forceAnimation);
  const frame = useRef(0);
  const [state, setState] = useState<"ready" | "playing" | "done">("ready");
  const stop = () => cancelAnimationFrame(frame.current);
  useEffect(() => {
    if (reduced && state === "playing") {
      cancelAnimationFrame(frame.current);
      time.set(duration);
      setState("done");
    }
  }, [reduced, state, time, duration]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const reset = () => {
    stop();
    time.set(0);
    setState("ready");
  };
  const play = () => {
    stop();
    time.set(0);
    if (reduced) {
      time.set(duration);
      setState("done");
      return;
    }
    setState("playing");
    let last = 0,
      elapsed = 0;
    const tick = (now: number) => {
      // Pause while hidden; don't race through an interaction on returning to the tab.
      if (last && !document.hidden)
        elapsed += Math.min((now - last) / 1000, 0.04);
      last = now;
      time.set(Math.min(elapsed, duration));
      if (elapsed < duration) frame.current = requestAnimationFrame(tick);
      else setState("done");
    };
    frame.current = requestAnimationFrame(tick);
  };
  return { time, state, play, reset, reduced };
}
