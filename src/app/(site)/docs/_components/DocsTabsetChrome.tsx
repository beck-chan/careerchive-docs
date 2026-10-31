"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { DocsGear } from "./DocsGear";
import { DocsLock } from "./DocsLock";

export type DocsTabMeta = {
  label: string;
  icon?: "lock" | "gear";
  iconPlace?: "before" | "after";
};

function TabLabel({ label, icon, iconPlace = "after" }: DocsTabMeta) {
  const glyph =
    icon === "lock" ? (
      <DocsLock />
    ) : icon === "gear" ? (
      <DocsGear />
    ) : null;

  if (iconPlace === "before") {
    return (
      <>
        {glyph}
        {label}
      </>
    );
  }

  return (
    <>
      {label}
      {glyph}
    </>
  );
}

function moveSibling(
  event: React.KeyboardEvent<HTMLButtonElement>,
  next: number,
  selector: string,
) {
  event.preventDefault();
  const siblings = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
    selector,
  );
  siblings?.[next]?.focus();
}

function applyActive(root: HTMLElement | null, index: number) {
  if (!root) {
    return;
  }

  root.querySelectorAll<HTMLElement>("[data-docs-tab-panel]").forEach((panel) => {
    const selected = Number(panel.dataset.docsTabPanel) === index;
    panel.hidden = !selected;
    panel.classList.toggle("is-active", selected);
  });
}

export function DocsTabsetChrome({
  baseId,
  tabs,
}: {
  baseId?: string;
  tabs: DocsTabMeta[];
}) {
  const fallbackId = useId();
  const resolvedId = baseId ?? fallbackId;
  const listRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const last = tabs.length - 1;
  const activeTab = tabs[active];

  function tabsetRoot() {
    return listRef.current?.closest<HTMLElement>(".docs-tabset") ?? null;
  }

  function choose(index: number) {
    setActive(index);
    setMenuOpen(false);
    applyActive(tabsetRoot(), index);
  }

  useLayoutEffect(() => {
    const root = listRef.current?.closest<HTMLElement>(".docs-tabset") ?? null;
    applyActive(root, active);
    if (!root) {
      return;
    }

    const observer = new MutationObserver(() => applyActive(root, active));
    observer.observe(root, { childList: true });
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");

    function sync() {
      if (!media.matches) {
        setMenuOpen(false);
      }
    }

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!selectRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <div ref={listRef} className="docs-tabset-list" role="tablist">
        {tabs.map((tab, index) => {
          const selected = index === active;

          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              id={`${resolvedId}-tab-${index}`}
              className={`docs-tabset-tab${selected ? " is-active" : ""}`}
              aria-selected={selected}
              aria-controls={`${resolvedId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  const next = index === last ? 0 : index + 1;
                  choose(next);
                  moveSibling(event, next, '[role="tab"]');
                } else if (event.key === "ArrowLeft") {
                  const next = index === 0 ? last : index - 1;
                  choose(next);
                  moveSibling(event, next, '[role="tab"]');
                } else if (event.key === "Home") {
                  choose(0);
                  moveSibling(event, 0, '[role="tab"]');
                } else if (event.key === "End") {
                  choose(last);
                  moveSibling(event, last, '[role="tab"]');
                }
              }}
            >
              <TabLabel label={tab.label} icon={tab.icon} iconPlace={tab.iconPlace} />
            </button>
          );
        })}
      </div>
      <div className="docs-tabset-select" ref={selectRef}>
        <button
          type="button"
          className="docs-tabset-select-trigger"
          aria-expanded={menuOpen}
          aria-controls={`${resolvedId}-select-menu`}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="docs-tabset-select-label">
            <TabLabel
              label={activeTab?.label ?? ""}
              icon={activeTab?.icon}
              iconPlace={activeTab?.iconPlace}
            />
          </span>
          <svg
            className="docs-tabset-select-chevron"
            viewBox="0 0 12 8"
            aria-hidden="true"
          >
            <path
              d="M1 1.5 6 6.5 11 1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          id={`${resolvedId}-select-menu`}
          className="docs-tabset-select-menu"
          role="menu"
          hidden={!menuOpen}
        >
          {tabs.map((tab, index) => {
            const selected = index === active;

            return (
              <button
                key={tab.label}
                type="button"
                role="menuitem"
                className={`docs-tabset-select-option${selected ? " is-active" : ""}`}
                onClick={() => choose(index)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    moveSibling(
                      event,
                      index === last ? 0 : index + 1,
                      '[role="menuitem"]',
                    );
                  } else if (event.key === "ArrowUp") {
                    moveSibling(
                      event,
                      index === 0 ? last : index - 1,
                      '[role="menuitem"]',
                    );
                  } else if (event.key === "Home") {
                    moveSibling(event, 0, '[role="menuitem"]');
                  } else if (event.key === "End") {
                    moveSibling(event, last, '[role="menuitem"]');
                  }
                }}
              >
                <TabLabel label={tab.label} icon={tab.icon} iconPlace={tab.iconPlace} />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
