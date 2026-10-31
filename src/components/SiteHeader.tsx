"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  applyDocumentTheme,
  DEFAULT_THEME,
  getThemeSnapshot,
  readStoredTheme,
  subscribeTheme,
  writeTheme,
} from "@/lib/theme";

const NAV = [
  { href: "/", label: "Home", external: false, mobileOnly: true },
  { href: "/docs", label: "Docs", external: false },
  {
    href: "https://github.com/beck-chan/career-chive/releases",
    label: "Releases",
    external: true,
  },
  {
    href: "https://github.com/beck-chan/career-chive/blob/main/LICENSE",
    label: "LICENSE",
    external: true,
  },
  {
    href: "https://ko-fi.com/beckchan",
    label: "Donate",
    external: true,
  },
] as const;

const ISSUES_URL = "https://github.com/beck-chan/career-chive/issues";

function Wordmark() {
  return (
    <>
      <Image
        className="app-wordmark-mark is-light"
        src="/favicon-light.svg"
        alt=""
        width={32}
        height={32}
        aria-hidden="true"
        unoptimized
      />
      <Image
        className="app-wordmark-mark is-dark"
        src="/favicon-dark.svg"
        alt=""
        width={32}
        height={32}
        aria-hidden="true"
        unoptimized
      />
      <span className="app-wordmark-text">
        <span className="app-wordmark-career">Career</span>
        <span className="app-wordmark-chive">Chive</span>
      </span>
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);
  if (navPath !== pathname) {
    setNavPath(pathname);
    setNavOpen(false);
  }
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => DEFAULT_THEME,
  );

  useEffect(() => {
    if (!navOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setNavOpen(false);
    }
    function onPointer(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".app-header")) setNavOpen(false);
    }
    function onResize() {
      if (window.innerWidth > 900) setNavOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, [navOpen]);

  useLayoutEffect(() => {
    applyDocumentTheme(theme, false);
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const stored = readStoredTheme() ?? DEFAULT_THEME;
      if (root.getAttribute("data-theme") !== stored) {
        applyDocumentTheme(stored, false);
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [theme, pathname]);

  return (
    <header className="app-header">
      <Link
        href="/"
        className="app-wordmark app-wordmark-static"
        aria-label="CareerChive"
      >
        <Wordmark />
      </Link>
      <button
        type="button"
        className="app-wordmark-toggle"
        aria-expanded={navOpen}
        aria-controls="intro-nav"
        onClick={() => setNavOpen((open) => !open)}
      >
        <span className="app-wordmark">
          <Wordmark />
        </span>
        <svg
          className="brand-caret"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <nav
        id="intro-nav"
        className={`app-nav${navOpen ? " is-open" : ""}`}
        aria-label="Intro"
      >
        {NAV.map((item) => {
          const mobileOnly = "mobileOnly" in item && item.mobileOnly;
          const active =
            !item.external &&
            (item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`));
          const className = [
            active ? "is-active" : undefined,
            mobileOnly ? "is-mobile-only" : undefined,
          ]
            .filter(Boolean)
            .join(" ") || undefined;
          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {item.label}
              </a>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={className}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="header-action">
        <div
          className={`theme-toggle${theme === "dark" ? " is-dark" : ""}`}
          role="group"
          aria-label="Theme"
        >
          <button
            type="button"
            className={theme === "light" ? "is-active" : undefined}
            aria-pressed={theme === "light"}
            title="Light Mode"
            aria-label="Light Mode"
            onClick={() => writeTheme("light")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="3.6"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 3.2v1.7M12 19.1v1.7M4.9 4.9l1.2 1.2M17.9 17.9l1.2 1.2M3.2 12h1.7M19.1 12h1.7M4.9 19.1l1.2-1.2M17.9 6.1l1.2-1.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={theme === "dark" ? "is-active" : undefined}
            aria-pressed={theme === "dark"}
            title="Dark Mode"
            aria-label="Dark Mode"
            onClick={() => writeTheme("dark")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16.4 3.8A8.6 8.6 0 1 0 20.2 15.2 7.1 7.1 0 0 1 16.4 3.8Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <a
          className="icon-btn github-icon"
          href={ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub issues"
          aria-label="GitHub issues"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
