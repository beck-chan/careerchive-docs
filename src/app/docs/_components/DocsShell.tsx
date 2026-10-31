import { DocsNav } from "../_nav/DocsNav";
import { DocsRail } from "./DocsRail";

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-cols">
      <div className="org-layout">
        <aside className="org-sidebar">
          <DocsNav />
        </aside>
        <div className="org-day">{children}</div>
        <aside className="org-calendar">
          <DocsRail />
        </aside>
      </div>
    </div>
  );
}
