import Guide, { title, frontmatter } from "./content.mdx";
import { DocsArticle } from "../../_components/DocsArticle";
import { DocsMermaid } from "../../_components/DocsMermaid";

export const metadata = { title };

export default function Page() {
  return (
    <DocsArticle title={title} subtitle={frontmatter?.subtitle}>
      <Guide components={{ DocsMermaid }} />
    </DocsArticle>
  );
}
