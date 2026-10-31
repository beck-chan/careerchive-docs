"use client";

import { useEffect, useMemo, useState } from "react";
import {
  filterCatalog,
  scalarTagSlug,
  type ApiCatalogRow,
} from "@/lib/docs/apiCatalog";

function TagGlyph() {
  return (
    <svg
      className="search-chat-result-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.6 13.05 13.07 20.6a2 2 0 0 1-2.83 0L3.4 13.76A2 2 0 0 1 2.8 12.3l1.2-6.4A2 2 0 0 1 5.9 4.2l6.4-1.2a2 2 0 0 1 1.46.6l7.84 7.84a2 2 0 0 1 0 2.61Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="8.2" cy="8.2" r="1.15" fill="currentColor" />
    </svg>
  );
}

function OperationGlyph() {
  return (
    <svg
      className="search-chat-result-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.4"
        y="3.4"
        width="17.2"
        height="17.2"
        rx="3.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M10 8.6 16 12l-6 3.4V8.6Z" fill="currentColor" />
    </svg>
  );
}

function hrefVariants(value: string) {
  const variants = new Set([value]);
  try {
    variants.add(decodeURIComponent(value));
  } catch {
    /* ignore malformed percent-encoding */
  }
  try {
    variants.add(encodeURI(value));
  } catch {
    /* ignore */
  }
  return variants;
}

function scalarizeHash(hash: string) {
  const match = hash.match(/^#tag\/([^/]+)(\/.*)?$/);
  if (!match) return hash;
  return `#tag/${scalarTagSlug(match[1])}${match[2] ?? ""}`;
}

function hrefMatches(href: string, hash: string) {
  const hashes = hrefVariants(hash);
  for (const candidate of hrefVariants(href)) {
    if (hashes.has(candidate)) return true;
  }
  return false;
}

function findExplorerLink(doc: Document, hash: string) {
  for (const target of hrefVariants(hash)) {
    for (const link of doc.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      if (hrefMatches(link.getAttribute("href") ?? "", target)) return link;
    }
  }
  return null;
}

function findExplorerSection(doc: Document, hash: string) {
  const ids: string[] = [];
  for (const variant of hrefVariants(hash.replace(/^#/, ""))) {
    ids.push(variant, `api/${variant}`);
  }
  for (const id of ids) {
    const section = doc.getElementById(id);
    if (section) return section;
  }
  return null;
}

function tagHashFrom(hash: string) {
  const match = hash.match(/^#tag\/([^/]+)/);
  return match ? `#tag/${match[1]}` : null;
}

function expandTagGroup(doc: Document, tagHash: string) {
  const slug = tagHash.replace(/^#tag\//, "");
  const needles = new Set([
    slug,
    slug.replace(/-/g, "_"),
    slug.replace(/_/g, "-"),
  ]);
  for (const button of doc.querySelectorAll<HTMLButtonElement>(
    "button[aria-expanded='false']",
  )) {
    const label = (button.getAttribute("aria-label") ?? "").toLowerCase();
    if (!label.startsWith("open group")) continue;
    const name = label.replace(/^open group\s*-+\s*/i, "").trim();
    if (needles.has(name) || needles.has(scalarTagSlug(name))) {
      button.click();
      break;
    }
  }
  const collapsed = [
    ...doc.querySelectorAll<HTMLElement>(".tag-section-collapsed"),
  ].find((el) => scalarTagSlug(el.textContent ?? "").includes(slug));
  collapsed?.click();
  findExplorerLink(doc, tagHash)?.click();
}

function applyExplorerHash(win: Window, hash: string, force = false) {
  const next = hash.startsWith("#") ? hash : `#${hash}`;
  if (win.location.hash === next) {
    if (!force) return;
    win.history.replaceState(
      null,
      "",
      `${win.location.pathname}${win.location.search}`,
    );
  }
  win.location.hash = next;
}

let explorerJumpTimer = 0;

export function openInExplorer(hash: string) {
  const iframe = document.querySelector<HTMLIFrameElement>(".docs-api-frame");
  const doc = iframe?.contentDocument;
  const win = iframe?.contentWindow;
  if (!iframe || !doc || !win) return;

  window.clearTimeout(explorerJumpTimer);
  const target = scalarizeHash(hash);
  const tagHash = tagHashFrom(target);

  let tries = 0;
  const jump = () => {
    const link = findExplorerLink(doc, target);
    if (link) {
      applyExplorerHash(win, target, true);
      link.click();
      return;
    }
    const section = findExplorerSection(doc, target);
    if (section) {
      applyExplorerHash(win, target);
      section.scrollIntoView();
      return;
    }
    if (tagHash && (tries === 0 || tries === 4)) {
      expandTagGroup(doc, tagHash);
    }
    if (tries === 4) {
      doc.querySelector<HTMLButtonElement>("button.show-more")?.click();
    }
    if (tries >= 24) {
      applyExplorerHash(win, target, true);
      return;
    }
    tries += 1;
    explorerJumpTimer = window.setTimeout(jump, 50);
  };
  jump();
}

export function useApiCatalog() {
  const [items, setItems] = useState<ApiCatalogRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/docs/api/catalog")
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items?: ApiCatalogRow[] }) => {
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}

export function ApiCatalogResults({
  items,
  onPick,
}: {
  items: ApiCatalogRow[];
  onPick?: () => void;
}) {
  if (items.length === 0) return null;

  return (
    <ul className="search-chat-results">
      {items.map((item) => (
        <li key={`${item.kind}-${item.hash}`}>
          <button
            type="button"
            className={`search-chat-result is-${item.kind}`}
            onClick={() => {
              openInExplorer(item.hash);
              onPick?.();
            }}
          >
            <span className="search-chat-result-copy">
              <span className="search-chat-result-title">{item.title}</span>
              {item.kind === "tag" && item.subtitle ? (
                <span className="search-chat-result-sub">{item.subtitle}</span>
              ) : null}
            </span>
            {item.kind === "tag" ? <TagGlyph /> : <OperationGlyph />}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function DocsApiSearch() {
  const [query, setQuery] = useState("");
  const items = useApiCatalog();
  const results = useMemo(
    () => filterCatalog(items, query),
    [items, query],
  );

  return (
    <div className="search-chat" aria-label="API search">
      <div className="search-chat-history">
        <ApiCatalogResults items={results} />
      </div>
      <form
        className="search-chat-compose-wrap"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="search-chat-compose">
          <label>
            <span className="sr-only">Search the API</span>
            <textarea
              rows={2}
              placeholder="Search the API ..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.preventDefault();
              }}
            />
          </label>
        </div>
        <div className="day-form-actions">
          <button
            type="button"
            className="text-link"
            disabled={!query}
            onClick={() => setQuery("")}
          >
            Clear Search
          </button>
        </div>
      </form>
    </div>
  );
}
