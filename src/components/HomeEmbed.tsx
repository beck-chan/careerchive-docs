"use client";

import { useLayoutEffect, useRef } from "react";
import { HOME_FRAME } from "./home-slides";

const DEMO_ORIGIN = "https://careerchive-demo.vercel.app";

function frameSrc(href: string) {
  try {
    const url = new URL(href);
    if (url.origin === DEMO_ORIGIN) {
      return `/demo-frame?path=${encodeURIComponent(`${url.pathname}${url.search}`)}`;
    }
  } catch {
    return href;
  }
  return href;
}

function frameSandbox(src: string) {
  // A same-origin frame with allow-same-origin drops the sandbox entirely.
  if (src.startsWith("/")) return "allow-scripts";
  return "allow-scripts allow-same-origin";
}

type HomeEmbedProps = {
  src: string;
  title: string;
  live?: boolean;
};

type ContentBox = {
  width: number;
  height: number;
};

export function HomeEmbed({ src: href, title, live = true }: HomeEmbedProps) {
  const src = frameSrc(href);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const contentRef = useRef<ContentBox>({
    width: HOME_FRAME.width,
    height: HOME_FRAME.height,
  });

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const fit = () => {
      const { clientWidth, clientHeight } = frame;
      if (!clientWidth || !clientHeight) return;
      const content = contentRef.current;
      const scale = Math.min(
        clientWidth / content.width,
        clientHeight / content.height,
      );
      const x = (clientWidth - content.width * scale) / 2;
      const y = (clientHeight - content.height * scale) / 2;
      frame.style.setProperty("--embed-scale", String(scale));
      frame.style.setProperty("--embed-x", `${x}px`);
      frame.style.setProperty("--embed-y", `${y}px`);
      if (!live) return;
      const box = frame.closest<HTMLElement>(".home-gallery-frame, .home-figure-cycle");
      box?.style.setProperty("--home-embed-ratio", String(content.width / content.height));
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as { source?: string; width?: number; height?: number } | null;
      if (!data || data.source !== "careerchive-embed") return;
      if (typeof data.width !== "number" || typeof data.height !== "number") return;
      if (data.width < 100 || data.height < 100) return;
      contentRef.current = { width: data.width, height: data.height };
      fit();
    };

    const blockMenu = (event: Event) => {
      event.preventDefault();
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    frame.addEventListener("contextmenu", blockMenu);
    window.addEventListener("message", onMessage);
    return () => {
      observer.disconnect();
      frame.removeEventListener("contextmenu", blockMenu);
      window.removeEventListener("message", onMessage);
    };
  }, [live]);

  return (
    <div ref={frameRef} className="home-embed" aria-hidden="true">
      {/* Scripts only. Popups and top-level navigation stay disabled. */}
      <iframe
        ref={iframeRef}
        className="home-embed-frame"
        src={src}
        title={title}
        tabIndex={-1}
        inert
        scrolling="no"
        sandbox={frameSandbox(src)}
        style={{ width: HOME_FRAME.width, height: HOME_FRAME.height }}
      />
      <div className="home-embed-shield" />
    </div>
  );
}
