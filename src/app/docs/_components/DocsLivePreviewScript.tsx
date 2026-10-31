"use client";

import { useEffect } from "react";
import { DOCS_LIVE_PREVIEW_SCRIPT } from "@/lib/mdx/docs-live-preview-script";

export function DocsLivePreviewScript() {
  useEffect(() => {
    if (document.getElementById("docs-live-preview")) return;
    const script = document.createElement("script");
    script.id = "docs-live-preview";
    script.textContent = DOCS_LIVE_PREVIEW_SCRIPT;
    document.body.appendChild(script);
  }, []);
  return null;
}
