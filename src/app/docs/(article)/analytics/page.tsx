import Guide, { title, frontmatter } from "./content.mdx";
import { DocsArticle } from "../../_components/DocsArticle";

export const metadata = { title };

export default function Page() {
  return (
    <DocsArticle title={title} subtitle={frontmatter?.subtitle}>
      <Guide />
    </DocsArticle>
  );
}
