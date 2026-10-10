import {
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
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
        e.currentTarget.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.035}px, ${(e.clientY - r.top - r.height / 2) * 0.06}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
      <span className="button-icon">
        <Icon name={download ? "download" : "arrow"} size={16} />
      </span>
    </a>
  );
}
export function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    typeof document === "undefined"
      ? "light"
      : document.documentElement.dataset.theme || "light",
  );
  const reduced = useReducedMotion();
  const busy = useRef(false);
  const change = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (busy.current) return;
    const next = theme === "dark" ? "light" : "dark";
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2,
      y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    const apply = () => {
      document.documentElement.dataset.theme = next;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", next === "dark" ? "#0E1114" : "#FAF8F5");
      setTheme(next);
      try {
        localStorage.setItem("sai-theme", next);
      } catch {
        /* Storage is optional. */
      }
    };
    if (!document.startViewTransition || reduced) {
      apply();
      if (!reduced && document.documentElement.animate)
        document.documentElement.animate([{ opacity: 0.75 }, { opacity: 1 }], {
          duration: 220,
        });
      return;
    }
    busy.current = true;
    try {
      const transition = document.startViewTransition(apply);
      await transition.ready;
      await document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 570,
          easing: "cubic-bezier(.22,1,.36,1)",
          pseudoElement: "::view-transition-new(root)",
        },
      ).finished;
      await transition.finished;
    } catch {
      apply();
    } finally {
      busy.current = false;
    }
  };
  return (
    <button
      className="theme-toggle"
      onClick={change}
      aria-label={`Switch to ${theme === "dark" ? "Day" : "Night"} Shift`}
      title={`Switch to ${theme === "dark" ? "Day" : "Night"} Shift`}
    >
      <span className="shift-symbol" aria-hidden="true">
        <svg
          className="shift-sun"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
        <svg
          className="shift-moon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19.8 15.4A8.4 8.4 0 0 1 8.6 4.2a8.5 8.5 0 1 0 11.2 11.2Z" />
          <path d="M17.5 3v4m-2-2h4M21 9v2m-1-1h2" />
        </svg>
      </span>
      <span className="theme-label">
        {theme === "dark" ? "Night" : "Day"} shift
      </span>
    </button>
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
