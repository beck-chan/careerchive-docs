import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DocsChat, DocsChatProvider } from "./_components/DocsChat";
import { DocsLivePreviewScript } from "./_components/DocsLivePreviewScript";
import { DocsMobileNav } from "./_components/DocsMobileNav";
import { DocsSearchProvider } from "./_components/DocsSearch";

export const metadata: Metadata = {
  title: {
    default: "Docs · CareerChive",
    template: "%s · CareerChive Docs",
  },
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsSearchProvider>
      <DocsChatProvider>
        {children}
        <DocsChat />
        <DocsMobileNav />
        {process.env.NODE_ENV === "development" ? (
          <DocsLivePreviewScript />
        ) : null}
      </DocsChatProvider>
    </DocsSearchProvider>
  );
}
