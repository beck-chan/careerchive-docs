"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { getThemeSnapshot, subscribeTheme } from "@/lib/theme";

const MOBILE_QUERY = "(max-width: 900px)";

function subscribeMobile(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMobile() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function applyExplorerLayout(
  iframe: HTMLIFrameElement | null,
  mobile: boolean,
) {
  const root = iframe?.contentDocument?.documentElement;
  if (!root) return;
  if (mobile) {
    root.setAttribute("data-layout", "mobile");
    return;
  }
  root.removeAttribute("data-layout");
  root.classList.remove("sidebar-overlay-open");
}

export function DocsApiExplorer() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => "dark" as const,
  );
  const mobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    applyExplorerLayout(iframeRef.current, mobile);
  }, [mobile]);

  return (
    <iframe
      ref={iframeRef}
      className="docs-api-frame"
      src={`/docs/api/explorer?theme=${theme}${mobile ? "&mobile=1" : ""}`}
      title="CareerChive API Library"
      onLoad={() => applyExplorerLayout(iframeRef.current, mobile)}
    />
  );
}
