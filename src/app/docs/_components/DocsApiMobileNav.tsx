"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { filterCatalog } from "@/lib/docs/apiCatalog";
import { ApiCatalogResults, useApiCatalog } from "./DocsApiSearch";
import { useDocsSearch } from "./DocsSearch";

const API_PATH = "/docs/api";
const MOBILE_QUERY = "(max-width: 900px)";
export const API_SIDEBAR_MESSAGE = "careerchive-api-sidebar";

function normalizePath(pathname: string) {
  return pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

function setExplorerSidebar(open: boolean) {
  const iframe = document.querySelector<HTMLIFrameElement>(".docs-api-frame");
  const win = iframe?.contentWindow;
  if (!win) return;
  win.postMessage({ type: API_SIDEBAR_MESSAGE, open }, "*");
  try {
    const root = win.document.documentElement;
    if (open) root.setAttribute("data-layout", "mobile");
    root.classList.toggle("sidebar-overlay-open", open);
    const backdrop = win.document.getElementById("api-sidebar-backdrop");
    if (backdrop) backdrop.hidden = !open;
  } catch {
    // postMessage still opens the overlay when the iframe document is not readable yet.
  }
}

function MenuGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DocsApiMobileNav() {
  const pathname = normalizePath(usePathname());
  const { open: docsSearchOpen } = useDocsSearch();
  const [navPath, setNavPath] = useState(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const apiFieldPointer = useRef(false);
  if (navPath !== pathname) {
    setNavPath(pathname);
    setSidebarOpen(false);
    setSearchOpen(false);
  }
  if (docsSearchOpen && searchOpen) {
    setSearchOpen(false);
  }
  const items = useApiCatalog();
  const results = useMemo(
    () => filterCatalog(items, query),
    [items, query],
  );

  useEffect(() => {
    const iframe = document.querySelector(".docs-api-frame");
    function syncSidebar() {
      setExplorerSidebar(sidebarOpen);
    }
    iframe?.addEventListener("load", syncSidebar);
    return () => iframe?.removeEventListener("load", syncSidebar);
  }, [sidebarOpen]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (
        event.data?.type === API_SIDEBAR_MESSAGE &&
        event.data.open === false
      ) {
        setSidebarOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSidebarOpen(false);
      setSearchOpen(false);
      setExplorerSidebar(false);
    }
    function onResize() {
      if (window.matchMedia(MOBILE_QUERY).matches) return;
      setSidebarOpen(false);
      setSearchOpen(false);
      setExplorerSidebar(false);
    }
    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (pathname !== API_PATH) return null;

  function openSidebar() {
    const next = !sidebarOpen;
    setSearchOpen(false);
    setSidebarOpen(next);
    setExplorerSidebar(next);
  }

  function openSearch() {
    if (docsSearchOpen || !apiFieldPointer.current) return;
    setSidebarOpen(false);
    setExplorerSidebar(false);
    setSearchOpen(true);
  }

  function pickResult() {
    setSearchOpen(false);
    setSidebarOpen(false);
    setExplorerSidebar(false);
  }

  return (
    <>
      <div className="docs-api-mobile-bar day-tabs">
        <button
          type="button"
          className="docs-api-mobile-menu"
          aria-label="Open API sidebar"
          aria-expanded={sidebarOpen}
          onClick={openSidebar}
        >
          <MenuGlyph />
        </button>
        <div className="docs-api-mobile-search-tools">
          <button
            type="button"
            className="text-link docs-api-mobile-clear"
            disabled={!query}
            onClick={() => setQuery("")}
          >
            Clear
          </button>
          <label className="docs-api-mobile-search-field">
            <span className="sr-only">Search the API</span>
            <input
              type="search"
              placeholder="Search the API ..."
              value={query}
              onPointerDown={() => {
                apiFieldPointer.current = true;
              }}
              onChange={(event) => {
                setQuery(event.target.value);
                openSearch();
              }}
              onFocus={openSearch}
              onBlur={() => {
                apiFieldPointer.current = false;
              }}
            />
          </label>
        </div>
      </div>
      {searchOpen ? (
        <div className="docs-api-mobile-search" role="dialog" aria-label="API search">
          <button
            type="button"
            className="docs-api-mobile-search-dismiss"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          />
          <div className="docs-api-mobile-search-sheet">
            <ApiCatalogResults items={results} onPick={pickResult} />
          </div>
        </div>
      ) : null}
    </>
  );
}
