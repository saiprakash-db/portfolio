import { useEffect, useRef, useState } from "react";
import { contactCopy, profile } from "../data";
import { Icon } from "./ui";
export function CopyEmail() {
  const [status, setStatus] = useState<"ready" | "copied" | "failed">("ready");
  const [busy, setBusy] = useState(false);
  const mounted = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);
  const copy = async () => {
    setBusy(true);
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(profile.email);
      if (mounted.current) setStatus("copied");
    } catch {
      if (mounted.current) setStatus("failed");
    } finally {
      if (mounted.current) {
        setBusy(false);
        timer.current = setTimeout(() => setStatus("ready"), 6000);
      }
    }
  };
  return (
    <div className="copy-email">
      <button type="button" onClick={copy} disabled={busy}>
        {status === "copied" ? (
          <Icon name="check" size={16} />
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="8" y="8" width="12" height="13" rx="2" />
            <path d="M16 5V3H4v13h2" />
          </svg>
        )}
        {status === "copied" ? contactCopy.success : contactCopy.action}
      </button>
      <span
        role="status"
        className={status === "failed" ? "copy-email-error" : "sr-only"}
      >
        {status === "failed"
          ? contactCopy.failure
          : status === "copied"
            ? contactCopy.success
            : ""}
      </span>
    </div>
  );
}
