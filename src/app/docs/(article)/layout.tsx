import { DocsShell } from "../_components/DocsShell";

export default function DocsArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsShell>{children}</DocsShell>;
}
