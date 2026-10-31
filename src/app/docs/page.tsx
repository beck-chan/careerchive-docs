import Link from "next/link";
import { DocsSearch } from "./_components/DocsSearch";
import { DOCS_NAV_SECTIONS } from "./_nav/docs-nav-data";
import { DOCS_PAGE_META } from "./_nav/docs-page-meta";

export default function DocsIndexPage() {
  return (
    <div className="docs-index">
      <div className="docs-index-search">
        <DocsSearch variant="bar" className="docs-nav-search" />
      </div>
      <div className="docs-index-sections">
        {DOCS_NAV_SECTIONS.map((section) => {
          const cards = (
            <ul className="docs-index-cards">
              {section.items.map((item) => {
                const page = DOCS_PAGE_META[item.href];
                const title = page?.title ?? item.label;
                const subtitle = page?.subtitle;
                return (
                  <li key={item.href}>
                    <Link
                      className={`docs-index-card${
                        item.href === "/docs/quickstart" ? " is-quickstart" : ""
                      }`}
                      href={item.href}
                    >
                      <span className="docs-index-card-title">{title}</span>
                      {subtitle ? (
                        <span className="docs-index-card-subtitle">
                          {subtitle}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          );

          if (section.collapsible) {
            return (
              <details
                key={section.title}
                className="docs-index-section is-internal docs-collapse"
              >
                <summary>
                  <h2 className="docs-index-heading">{section.title}</h2>
                </summary>
                {cards}
              </details>
            );
          }

          return (
            <section key={section.title} className="docs-index-section">
              <h2 className="docs-index-heading">{section.title}</h2>
              {cards}
            </section>
          );
        })}
      </div>
    </div>
  );
}
