import Guide, { title, frontmatter } from "./content.mdx";
import { DocsApiExplorer } from "../../_components/DocsApiExplorer";
import { DocsArticle } from "../../_components/DocsArticle";

export const metadata = { title };

export default function Page() {
  return (
    <DocsArticle title={title} subtitle={frontmatter?.subtitle}>
      <Guide components={{ DocsApiExplorer }} />
    </DocsArticle>
  );
}
