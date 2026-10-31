import { catalogFromSpec } from "@/lib/docs/apiCatalog";
import { loadDatabaseOpenApiOrNull } from "@/lib/docs/loadDatabaseOpenApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await loadDatabaseOpenApiOrNull();
  if (!catalog.spec) {
    return Response.json(
      { items: [], error: catalog.error ?? "OpenAPI fetch failed" },
      { status: 503 },
    );
  }

  return Response.json(
    { items: catalogFromSpec(catalog.spec) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
