import { visit } from "unist-util-visit";
import { createSlugger } from "./docs-slug.mjs";

function textOf(node) {
  if (node.type === "text" || node.type === "raw") {
    return node.value ?? "";
  }
  return (node.children ?? []).map(textOf).join("");
}

export default function rehypeDocsSlug() {
  return (tree) => {
    const slugger = createSlugger();
    visit(tree, "element", (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) {
        return;
      }
      node.properties ??= {};
      if (node.properties.id) {
        return;
      }
      const id = slugger.slug(textOf(node).trim());
      if (id) {
        node.properties.id = id;
      }
    });
  };
}
