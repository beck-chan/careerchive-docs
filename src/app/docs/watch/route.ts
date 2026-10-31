import { readFile } from "node:fs/promises";
import path from "node:path";
import { startDocsPreviewWatch } from "@/lib/mdx/start-docs-preview-watch";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response("0", { status: 404 });
  }

  startDocsPreviewWatch();

  try {
    const tick = await readFile(
      path.join(process.cwd(), ".next", "docs-watch-tick"),
      "utf8",
    );
    return new Response(tick, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch {
    return new Response("0", {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
