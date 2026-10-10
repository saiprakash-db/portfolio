import { useEffect, useRef, useState } from "react";
import { navigation } from "../data";
import { Icon } from "./ui";

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const entries = [
    ...navigation,
    { id: "olist", label: "Olist project" },
    { id: "kkbox", label: "KKBOX project" },
    { id: "education", label: "Education & certifications" },
  ].filter((n) => n.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      dialog.current?.showModal();
      input.current?.focus();
    } else dialog.current?.close();
  }, [open]);

  useEffect(() => {
    if (open && entries[selected])
      document
        .getElementById(`command-${entries[selected].id}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [selected, query, open]);

  const navigate = (id: string) => {
    dialog.current?.close();
    onClose();
    // Let the modal scroll lock settle before jumping.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const section = document.getElementById(id);
        if (!section) return;
        if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
        section.setAttribute("tabindex", "-1");
        section.focus({ preventScroll: true });
        section.scrollIntoView({
          block: "start",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }),
    );
  };

  return (
    <dialog
      ref={dialog}
      className="command-dialog"
      aria-label="Navigate the portfolio"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const bounds = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < bounds.left ||
          e.clientX > bounds.right ||
          e.clientY < bounds.top ||
          e.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <div className="command-search">
        <Icon name="search" size={19} />
        <input
          ref={input}
          value={query}
          placeholder="Search this portfolio…"
          aria-label="Search sections"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="command-results"
          aria-activedescendant={
            entries[selected] ? `command-${entries[selected].id}` : undefined
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setSelected(
                (i) =>
                  (i + (e.key === "ArrowDown" ? 1 : -1) + entries.length) %
                  Math.max(entries.length, 1),
              );
            }
            if (e.key === "Enter" && entries[selected]) {
              e.preventDefault();
              navigate(entries[selected].id);
            }
          }}
        />
        <button
          className="icon-button command-close"
          onClick={onClose}
          aria-label="Close command palette"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="command-group-label">Jump to a section</div>
      <div
        id="command-results"
        role="listbox"
        aria-label="Sections"
        data-native-scroll
      >
        {entries.length ? (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              role="option"
              aria-selected={selected === index}
              id={`command-${entry.id}`}
              className={selected === index ? "selected" : ""}
              onPointerMove={() => setSelected(index)}
              onClick={() => navigate(entry.id)}
            >
              <span className="command-result-name">
                <Icon
                  name={
                    entry.id === "olist" || entry.id === "kkbox"
                      ? "code"
                      : "right"
                  }
                  size={16}
                />
                {entry.label}
              </span>
              <span className="command-result-enter" aria-hidden="true">
                ↵
              </span>
            </div>
          ))
        ) : (
          <p className="no-results" role="status">
            No matching sections. Try “Projects” or “About”.
          </p>
        )}
      </div>
      <div className="command-hint">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> Navigate
        </span>
        <span>
          <kbd>↵</kbd> Open <kbd>esc</kbd> Close
        </span>
      </div>
    </dialog>
  );
}
