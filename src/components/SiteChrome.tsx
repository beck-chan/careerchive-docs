import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">{children}</main>
    </div>
  );
}
