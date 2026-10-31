import { Children, isValidElement, type ReactNode } from "react";
import { DocsErdLegend } from "./DocsErdLegend";
import "../docs-mermaid.css";

export function DocsErdGrid({
  children,
  layout = "archive",
}: {
  children: ReactNode;
  layout?: "archive" | "chat" | "chivebot";
}) {
  const items = Children.toArray(children).filter((child) => isValidElement(child));

  if (layout === "chat") {
    const [session, limits, query, section] = items;
    return (
      <div className="docs-erd-grid docs-erd-grid-chat">
        <div className="docs-erd-session">{session}</div>
        <div className="docs-erd-side">
          <div className="docs-erd-limits">{limits}</div>
          <div className="docs-erd-section">{section}</div>
          <DocsErdLegend />
        </div>
        <div className="docs-erd-query">{query}</div>
      </div>
    );
  }

  if (layout === "chivebot") {
    const [thread, index] = items;
    return (
      <div className="docs-erd-grid docs-erd-grid-chivebot">
        <div className="docs-erd-thread">{thread}</div>
        <div className="docs-erd-index">
          {index}
          <DocsErdLegend />
        </div>
      </div>
    );
  }

  const [orgs, rows, settings, attempts] = items;

  return (
    <div className="docs-erd-grid">
      <div className="docs-erd-orgs">{orgs}</div>
      <div className="docs-erd-rows">
        {rows}
        <div className="docs-erd-settings">{settings}</div>
      </div>
      <DocsErdLegend />
      <div className="docs-erd-attempts">{attempts}</div>
    </div>
  );
}
