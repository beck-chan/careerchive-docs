import { cache } from "react";
import {
  applyOperationSecurity,
  type OpenApiSpec,
} from "./typesToOpenApi";
import { swagger2ToOpenApi31 } from "./swaggerToOpenApi";

const API_KEY_SCHEME = {
  type: "apiKey",
  in: "header",
  name: "apikey",
  description:
    "Supabase publishable key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Required on every Data API call. The app server uses `SUPABASE_SECRET_KEY`; do not paste the secret key into the browser.",
} as const;

function envOrThrow(name: string, value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Missing ${name} for docs OpenAPI fetch`);
  }
  return trimmed;
}

function restRoot(url: string) {
  const base = url.replace(/\/+$/, "");
  if (/\/rest\/v1$/i.test(base)) {
    return `${base}/`;
  }
  return `${base}/rest/v1/`;
}

const TAG_DESCRIPTIONS: Record<string, string> = {
  settings:
    "Archive settings in a single row (`id = 1`): Time Zone, Archive Start, Auto-Generate From, and User.",
  login_attempts:
    "`FLAG_PRIVATE` failed login POSTs. Counted independently per IP and per username (3 per rolling hour).",
  organizations: "Workplaces tracked in the archive.",
  days: "One row per organization and work date. Attendance, notes, rating, and comments live here.",
  work: "Work Completed rows on a day.",
  citations: "Citations / Artifacts rows on a day.",
  ensure_generated_days:
    "Inserts missing checked weekly days from Archive Start (gated by organization Date Active and Auto-generate From) through to your Time Zone today. Does nothing until Auto-generate From is set.",
  archive_today:
    "Calendar today in the archive Time Zone. Falls back to UTC if the zone is empty or invalid.",
  chivebot_session: "One ChiveBot chat thread. Clear Chat deletes this row.",
  chivebot_message: "Turns in a ChiveBot thread.",
  chivebot_query_embedding: "Embeddings for ChiveBot questions.",
  chivebot_entry_embedding: "Embeddings for archive entries used in retrieve.",
  match_chivebot_entries:
    "Retrieve similar archive entries for a query vector.",
};

function tagDescriptionKey(name: string) {
  return name.trim().toLowerCase().replace(/^\(rpc\)\s+/, "");
}

function collectTagNames(spec: OpenApiSpec) {
  const names: string[] = [];
  const seen = new Set<string>();
  const add = (name: string | undefined) => {
    if (!name || seen.has(name)) {
      return;
    }
    seen.add(name);
    names.push(name);
  };
  for (const tag of spec.tags ?? []) {
    add(tag.name);
  }
  for (const methods of Object.values(spec.paths ?? {})) {
    if (!methods) {
      continue;
    }
    for (const operation of Object.values(methods)) {
      if (!operation?.tags) {
        continue;
      }
      for (const name of operation.tags) {
        add(name);
      }
    }
  }
  return names;
}

function applyTagDescriptions(spec: OpenApiSpec) {
  const previous = new Map(
    (spec.tags ?? []).map((tag) => [tag.name, tag] as const),
  );
  spec.tags = collectTagNames(spec).map((name) => {
    const current = previous.get(name) ?? { name };
    const description = TAG_DESCRIPTIONS[tagDescriptionKey(name)];
    return description ? { ...current, name, description } : { ...current, name };
  });
}

const HIDDEN_RPCS = new Set([
  "rls_auto_enable",
  "hook_before_user_created",
  "set_settings_updated_at",
  "reject_days_outside_logging_window",
  "ensure_days_on_archive_start",
  "set_chivebot_session_updated_at",
  "set_chivebot_entry_embedding_updated_at",
  "search_docs_sections",
  "match_docs_sections",
  "trim_docs_query_embedding",
  "set_docs_chat_session_updated_at",
  "consume_docs_chat_quota",
]);
const HIDDEN_TABLES = new Set([
  "docs_section",
  "docs_query_embedding",
  "docs_chat_session",
  "docs_chat_message",
  "docs_chat_limits",
]);
const HIDDEN_PATHS = new Set([
  ...[...HIDDEN_RPCS].map((name) => `/rpc/${name}`),
  ...[...HIDDEN_TABLES].map((name) => `/${name}`),
]);

function catalogPathKey(path: string) {
  const trimmed = path.trim().toLowerCase().replace(/\/+$/, "");
  return trimmed || "/";
}

function isHiddenCatalogPath(path: string) {
  const key = catalogPathKey(path);
  if (HIDDEN_PATHS.has(key)) return true;
  const rpc = key.match(/^\/rpc\/([^/]+)$/);
  if (rpc && HIDDEN_RPCS.has(rpc[1])) return true;
  const table = key.replace(/^\//, "");
  return HIDDEN_TABLES.has(table);
}

function isHiddenCatalogTag(name: string) {
  const key = tagDescriptionKey(name);
  return HIDDEN_RPCS.has(key) || HIDDEN_TABLES.has(key);
}

function isHiddenComponentName(name: string) {
  const key = name.toLowerCase();
  for (const token of [...HIDDEN_TABLES, ...HIDDEN_RPCS]) {
    if (key === token) return true;
    if (
      key.startsWith(`${token}.`) ||
      key.startsWith(`${token}_`) ||
      key.includes(`.${token}.`) ||
      key.includes(`.${token}_`) ||
      key.endsWith(`.${token}`) ||
      key.endsWith(`/${token}`)
    ) {
      return true;
    }
  }
  return false;
}

function omitHiddenComponents(spec: OpenApiSpec) {
  const components = spec.components as Record<string, unknown> | undefined;
  if (!components) return;
  for (const group of Object.values(components)) {
    if (!group || typeof group !== "object") continue;
    const bag = group as Record<string, unknown>;
    for (const name of Object.keys(bag)) {
      if (isHiddenComponentName(name)) delete bag[name];
    }
  }
}

function omitPostgrestMeta(spec: OpenApiSpec) {
  if (spec.paths) {
    delete spec.paths["/"];
    delete spec.paths[""];
    for (const path of Object.keys(spec.paths)) {
      if (isHiddenCatalogPath(path)) {
        delete spec.paths[path];
      }
    }
  }
  if (spec.tags?.length) {
    spec.tags = spec.tags.filter(
      (tag) =>
        tag.name.toLowerCase() !== "introspection" &&
        !isHiddenCatalogTag(tag.name),
    );
  }
  omitHiddenComponents(spec);
}

function overlayInfo(spec: OpenApiSpec) {
  spec.info = {
    ...spec.info,
    title: "CareerChive API",
    version: spec.info?.version ?? "1.0.0",
    description:
      "### CareerChive Data API Reference\n\nType into Search the API ... to search the reference.",
  };
}

async function fetchOpenApi(): Promise<OpenApiSpec> {
  const url = envOrThrow(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  const key = envOrThrow(
    "SUPABASE_SECRET_KEY",
    process.env.SUPABASE_SECRET_KEY,
  );
  const response = await fetch(restRoot(url), {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/openapi+json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(
      `OpenAPI fetch failed: ${response.status} ${response.statusText}`,
    );
  }

  const spec = (await response.json()) as OpenApiSpec;
  if (!spec || typeof spec !== "object" || !spec.paths) {
    throw new Error("OpenAPI fetch returned no paths");
  }

  const normalized = swagger2ToOpenApi31(
    spec as Record<string, unknown>,
  ) as OpenApiSpec;
  omitPostgrestMeta(normalized);
  applyTagDescriptions(normalized);
  overlayInfo(normalized);
  normalized.components = normalized.components ?? {};
  normalized.components.securitySchemes = {
    ...normalized.components.securitySchemes,
    apikey: API_KEY_SCHEME,
  };
  normalized.security = [{ apikey: [] }];
  applyOperationSecurity(normalized.paths);
  delete normalized.host;
  delete normalized.basePath;
  delete normalized.schemes;
  delete normalized.servers;

  return normalized;
}

export const loadDatabaseOpenApi = cache(async (): Promise<OpenApiSpec> => {
  return fetchOpenApi();
});

export async function loadDatabaseOpenApiOrNull() {
  try {
    return { spec: await loadDatabaseOpenApi() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "OpenAPI fetch failed";
    console.error("[docs] OpenAPI catalog unavailable:", message);
    return { spec: null, error: message };
  }
}
