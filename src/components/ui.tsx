import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

export function CursorGlow() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(any-pointer: fine)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("is-visible");
      const target = event.target;
      const interactive =
        target instanceof Element &&
        Boolean(target.closest("a, button, [role='button'], input, textarea"));
      cursor.classList.toggle("is-over-interactive", interactive);
    };
    const leave = () => {
      cursor.classList.remove("is-visible", "is-over-interactive");
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <span className="cursor-follow" ref={cursorRef} aria-hidden="true">
      <span className="cursor-aura" />
      <span className="cursor-dot" />
    </span>
  );
}

export function Icon({
  name = "arrow",
  size = 20,
}: {
  name?: string;
  size?: number;
}) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 19 19 5M5 5h14v14" />
      </>
    ),
    right: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    code: (
      <>
        <path d="m7 6-6 6 6 6m10-12 6 6-6 6M14 3l-4 18" />
      </>
    ),
    pin: (
      <>
        <path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
export function External({
  href,
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      {...props}
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
export function Button({
  href,
  children,
  secondary = false,
  download = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  download?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  return (
    <a
      ref={ref}
      href={href}
      download={download || undefined}
      className={`button ${secondary ? "button-secondary" : ""}`}
      onPointerMove={(e) => {
        if (reduced || !matchMedia("(hover:hover) and (pointer:fine)").matches)
          return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--button-x",
          `${(e.clientX - r.left - r.width / 2) * 0.035}px`,
        );
        e.currentTarget.style.setProperty(
          "--button-y",
          `${(e.clientY - r.top - r.height / 2) * 0.06}px`,
        );
      }}
      onPointerLeave={() => {
        ref.current?.style.removeProperty("--button-x");
        ref.current?.style.removeProperty("--button-y");
      }}
    >
      {children}
      <span className="button-icon">
        <Icon name={download ? "download" : "arrow"} size={16} />
      </span>
    </a>
  );
}
export function SectionHeading({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          {index} / {label}
        </span>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
