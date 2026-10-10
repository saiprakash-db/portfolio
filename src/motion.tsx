import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduced
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 24, scale: 0.985, filter: "blur(7px)" }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -7% 0px" }}
      transition={{
        duration: reduced ? 0 : 0.68,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function Count({
  value,
  divisor = 1,
  decimals = 0,
  suffix = "",
  display,
}: {
  value: number;
  divisor?: number;
  decimals?: number;
  suffix?: string;
  display: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [text, setText] = useState(display);
  useEffect(() => {
    if (reduced) {
      setText(display);
      return;
    }
    if (!visible) return;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - start) / 1300, 1);
      const n = (value / divisor) * (1 - Math.pow(1 - progress, 3));
      setText(
        n.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) + suffix,
      );
      if (progress < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced, value, divisor, decimals, suffix, display]);
  return (
    <span ref={ref} aria-label={display}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}

export function Tilt({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 160, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 160, damping: 24 });
  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        if (
          reduced ||
          !matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((-(e.clientY - r.top - r.height / 2) / r.height) * 3);
        y.set(((e.clientX - r.left - r.width / 2) / r.width) * 3);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
