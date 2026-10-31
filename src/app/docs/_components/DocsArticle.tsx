import { DocsChatIcon } from "./DocsChat";
import { DocsApiMobileNav } from "./DocsApiMobileNav";
import { DocsSearch } from "./DocsSearch";

export function DocsArticle({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="day-heading">
        {subtitle ? <p className="day-title">{subtitle}</p> : null}
        <h1 className="page-title">{title}</h1>
        <div className="docs-heading-tools">
          <DocsChatIcon className="docs-chat-icon" />
          <DocsSearch
            variant="icon"
            className="docs-heading-search"
            label="Search documentation"
          />
        </div>
      </header>
      <div className="org-day-body">
        <DocsApiMobileNav />
        <article className="docs-article mdx-page">{children}</article>
      </div>
    </>
  );
}
