"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type TocItem = {
  href: string;
  label: string;
  depth: 2 | 3;
};

function readItems(root: Element | null): TocItem[] {
  const headings = [
    ...(root?.querySelectorAll("h2, h3") ?? []),
  ] as HTMLElement[];
  return headings
    .filter(
      (heading) =>
        heading.id && !heading.closest(".docs-callout, .docs-tabset"),
    )
    .map((heading) => ({
      href: `#${heading.id}`,
      label: heading.textContent?.trim() ?? "",
      depth: heading.tagName === "H3" ? (3 as const) : (2 as const),
    }));
}

function headingNodes(items: TocItem[]) {
  return items.flatMap((item) => {
    const element = document.getElementById(item.href.slice(1));
    return element ? [{ href: item.href, element }] : [];
  });
}

export function DocsToc() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    const root = document.querySelector(".org-day-body");
    let nodes = headingNodes(readItems(root));

    function currentHref() {
      let current = nodes[0]?.href ?? "";
      for (const node of nodes) {
        if (node.element.getBoundingClientRect().top <= 160) {
          current = node.href;
        }
      }
      return current;
    }

    function publish(next: TocItem[]) {
      nodes = headingNodes(next);
      setItems(next);
      setActiveHref(next[0]?.href ?? "");
    }

    let frame = 0;
    function updateActive() {
      setActiveHref(currentHref());
    }
    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActive();
      });
    }

    const observer = new MutationObserver(() => {
      publish(readItems(root));
    });
    if (root) observer.observe(root, { childList: true, subtree: true });

    const start = window.requestAnimationFrame(() => {
      publish(readItems(root));
      updateActive();
    });

    root?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", updateActive);
    return () => {
      window.cancelAnimationFrame(start);
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      root?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", updateActive);
    };
  }, [pathname]);

  return (
    <nav className="docs-toc" aria-label="Table of Contents">
      <p className="docs-toc-label">Table of Contents</p>
      {items.length > 0 ? (
        <ol className="docs-toc-list">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`docs-toc-link is-h${item.depth}${
                  item.href === activeHref ? " is-active" : ""
                }`}
                aria-current={item.href === activeHref ? "location" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <p className="docs-toc-empty">No sections.</p>
      )}
    </nav>
  );
}
