"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { DocsSearch } from "../_components/DocsSearch";
import { DOCS_NAV_SECTIONS, type DocsNavSection } from "./docs-nav-data";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname === `${href}/`;
}

function sectionIsActive(pathname: string, section: DocsNavSection) {
  return section.items.some((item) => isActive(pathname, item.href));
}

function NavLinks({
  section,
  pathname,
}: {
  section: DocsNavSection;
  pathname: string;
}) {
  return (
    <ul className="docs-nav-list">
      {section.items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              className={`docs-nav-link${active ? " is-active" : ""}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function CollapsibleNavSection({
  section,
  pathname,
}: {
  section: DocsNavSection;
  pathname: string;
}) {
  const active = sectionIsActive(pathname, section);
  const [open, setOpen] = useState(active);
  const [trackedPath, setTrackedPath] = useState(pathname);

  if (pathname !== trackedPath) {
    setTrackedPath(pathname);
    if (active) setOpen(true);
  }

  return (
    <details
      className="docs-nav-section docs-collapse"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="docs-nav-heading">{section.title}</summary>
      <NavLinks section={section} pathname={pathname} />
    </details>
  );
}

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="docs-nav" aria-label="Documentation">
      <DocsSearch variant="bar" className="docs-nav-search" />
      {DOCS_NAV_SECTIONS.map((section) =>
        section.collapsible ? (
          <CollapsibleNavSection
            key={section.title}
            section={section}
            pathname={pathname}
          />
        ) : (
          <div key={section.title} className="docs-nav-section">
            <p className="docs-nav-heading">{section.title}</p>
            <NavLinks section={section} pathname={pathname} />
          </div>
        ),
      )}
    </nav>
  );
}
