"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DOCS_NAV_SECTIONS } from "../_nav/docs-nav-data";
import { DocsChatIcon } from "./DocsChat";
import { DocsSearch } from "./DocsSearch";

function normalizePath(pathname: string) {
  return pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

export function DocsMobileNav() {
  const pathname = normalizePath(usePathname());
  const router = useRouter();
  const isLanding = pathname === "/docs";
  const matched = DOCS_NAV_SECTIONS.find((entry) =>
    entry.items.some((item) => item.href === pathname),
  );
  const section = matched ?? DOCS_NAV_SECTIONS[0];
  const selectValue = section.items.some((item) => item.href === pathname)
    ? pathname
    : (section.items[0]?.href ?? pathname);

  if (isLanding) {
    return (
      <div className="docs-mobile-nav is-landing">
        <DocsChatIcon className="docs-chat-icon" />
        <DocsSearch variant="bar" className="docs-nav-search" />
      </div>
    );
  }

  return (
    <div className="docs-mobile-nav">
      <nav className="day-tabs" aria-label="Documentation sections">
        {DOCS_NAV_SECTIONS.map((entry) => {
          const active = Boolean(matched) && entry.title === section.title;
          const href = active
            ? pathname
            : (entry.items[0]?.href ?? "/docs");
          return (
            <Link
              key={entry.title}
              href={href}
              className={active ? "is-active" : undefined}
              aria-current={active ? "page" : undefined}
            >
              {entry.title}
            </Link>
          );
        })}
      </nav>
      <label className="docs-mobile-guide">
        <span className="sr-only">Select a guide</span>
        <select
          className="docs-mobile-guide-select"
          value={selectValue}
          onChange={(event) => router.push(event.target.value)}
        >
          {section.items.map((item) => (
            <option key={item.href} value={item.href}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
