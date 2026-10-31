import type { OpenApiSpec } from "./typesToOpenApi";

const HTTP_METHODS = new Set([
  "get",
  "put",
  "post",
  "delete",
  "patch",
  "head",
  "options",
  "trace",
]);

export type ApiCatalogRow =
  | {
      kind: "tag";
      tag: string;
      title: string;
      subtitle: string;
      hash: string;
    }
  | {
      kind: "operation";
      tag: string;
      method: string;
      path: string;
      title: string;
      hash: string;
    };

function displayTagName(name: string) {
  return name.replace(/^\(rpc\)\s+/i, "");
}

/** Scalar sidebar/content anchors slugify tag names (`chivebot_message` → `chivebot-message`). */
export function scalarTagSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function explorerHash(
  tag: string,
  operation?: { method: string; path: string },
) {
  const slug = scalarTagSlug(tag);
  if (!operation) return `#tag/${slug}`;
  return `#tag/${slug}/${operation.method}${operation.path}`;
}

export function catalogFromSpec(spec: OpenApiSpec): ApiCatalogRow[] {
  const descriptions = new Map(
    (spec.tags ?? []).map((tag) => [tag.name, tag.description?.trim() ?? ""]),
  );
  const groups = new Map<string, ApiCatalogRow[]>();
  const order: string[] = [];

  function ensureTag(tag: string) {
    if (!groups.has(tag)) {
      groups.set(tag, []);
      order.push(tag);
    }
  }

  for (const tag of spec.tags ?? []) {
    ensureTag(tag.name);
  }

  for (const [path, methods] of Object.entries(spec.paths ?? {})) {
    if (!methods) continue;
    for (const [method, operation] of Object.entries(methods)) {
      if (!HTTP_METHODS.has(method.toLowerCase()) || !operation) continue;
      const verb = method.toUpperCase();
      const tag = operation.tags?.[0] ?? "default";
      ensureTag(tag);
      groups.get(tag)!.push({
        kind: "operation",
        tag,
        method: verb,
        path,
        title: path,
        hash: explorerHash(tag, { method: verb, path }),
      });
    }
  }

  const rows: ApiCatalogRow[] = [];
  for (const tag of order) {
    rows.push({
      kind: "tag",
      tag,
      title: displayTagName(tag),
      subtitle: descriptions.get(tag) ?? "",
      hash: explorerHash(tag),
    });
    rows.push(...(groups.get(tag) ?? []));
  }
  return rows;
}

export function filterCatalog(rows: ApiCatalogRow[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;

  const matchedTags = new Set<string>();
  for (const row of rows) {
    if (row.kind === "tag") {
      if (
        row.title.toLowerCase().includes(needle) ||
        row.subtitle.toLowerCase().includes(needle) ||
        row.tag.toLowerCase().includes(needle)
      ) {
        matchedTags.add(row.tag);
      }
    } else if (
      row.path.toLowerCase().includes(needle) ||
      row.method.toLowerCase().includes(needle) ||
      row.tag.toLowerCase().includes(needle)
    ) {
      matchedTags.add(row.tag);
    }
  }

  return rows.filter((row) => {
    if (!matchedTags.has(row.tag)) return false;
    if (row.kind === "tag") return true;
    const tagHit = rows.some(
      (item) =>
        item.kind === "tag" &&
        item.tag === row.tag &&
        (item.title.toLowerCase().includes(needle) ||
          item.subtitle.toLowerCase().includes(needle) ||
          item.tag.toLowerCase().includes(needle)),
    );
    if (tagHit) return true;
    return (
      row.path.toLowerCase().includes(needle) ||
      row.method.toLowerCase().includes(needle)
    );
  });
}
