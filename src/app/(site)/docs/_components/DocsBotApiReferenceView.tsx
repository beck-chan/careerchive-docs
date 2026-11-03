"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  SCALAR_STANDALONE_SRC,
  createScalarReferenceConfig,
} from "@/lib/docs/scalarConfig";
import type { OpenApiSpec } from "@/lib/docs/typesToOpenApi";
import {
  DEFAULT_THEME,
  getThemeSnapshot,
  subscribeTheme,
} from "@/lib/theme";
import "../docs-bot-api.css";

type ScalarInstance = {
  destroy?: () => void;
};

type ScalarGlobal = {
  createApiReference: (
    element: HTMLElement,
    configuration: Record<string, unknown>,
  ) => ScalarInstance | void;
};

function isIntroductionSearchRow(option: HTMLElement) {
  const title = option.querySelector(".font-medium")?.textContent?.trim() ?? "";
  if (title === "Introduction") {
    return true;
  }
  const label = option.querySelector(".sr-only")?.textContent?.trim() ?? "";
  const text = option.textContent?.replace(/\s+/g, " ").trim() ?? "";
  return /^heading\b/i.test(label) && /\bintroduction\b/i.test(text);
}

function hideIntroductionSearchRows(root: ParentNode) {
  const options: HTMLElement[] = [];
  if (root instanceof HTMLElement && root.matches('[role="option"]')) {
    options.push(root);
  }
  if ("querySelectorAll" in root) {
    options.push(...root.querySelectorAll<HTMLElement>('[role="option"]'));
  }
  for (const option of options) {
    if (option.getAttribute("data-docs-hide-heading") === "true") {
      continue;
    }
    if (!isIntroductionSearchRow(option)) {
      continue;
    }
    option.setAttribute("data-docs-hide-heading", "true");
    option.style.setProperty("display", "none", "important");
  }
}

function hideIntroductionNav(host: HTMLElement) {
  for (const el of host.querySelectorAll<HTMLElement>("[data-sidebar-id]")) {
    const id = el.getAttribute("data-sidebar-id") ?? "";
    if (!id.endsWith("/description/introduction")) {
      continue;
    }
    const ownsChildren = el.querySelector("[data-sidebar-id]") !== null;
    if (!ownsChildren) {
      el.setAttribute("data-docs-intro", "true");
      continue;
    }
    for (const label of el.querySelectorAll<HTMLElement>("a, button, div")) {
      if (label.querySelector("[data-sidebar-id]")) {
        continue;
      }
      const text = label.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const name = label.getAttribute("aria-label") ?? "";
      if (text === "Introduction" || /introduction$/i.test(name)) {
        label.setAttribute("data-docs-intro", "true");
      }
    }
  }
}

function isRouterInitError(error: unknown) {
  return error instanceof Error && error.message.includes("before initialization");
}

function guardHistory() {
  const push = history.pushState.bind(history);
  const replace = history.replaceState.bind(history);
  const queued: Array<() => void> = [];

  const wrap =
    (original: History["pushState"]): History["pushState"] =>
    (...args) => {
      try {
        return original(...args);
      } catch (error) {
        if (!isRouterInitError(error)) {
          throw error;
        }
        queued.push(() => {
          original(...args);
        });
      }
    };

  history.pushState = wrap(push);
  history.replaceState = wrap(replace);

  const replay = window.setInterval(() => {
    const job = queued[0];
    if (!job) {
      return;
    }
    try {
      job();
      queued.shift();
    } catch (error) {
      if (!isRouterInitError(error)) {
        queued.shift();
      }
    }
  }, 50);

  return () => {
    window.clearInterval(replay);
    history.pushState = push;
    history.replaceState = replace;
  };
}

function pinEmbed(host: HTMLElement) {
  const nativeScrollTo = window.scrollTo.bind(window);
  const nativeScroll = window.scroll.bind(window);
  const nativeIntoView = Element.prototype.scrollIntoView;
  const nativeFocus = HTMLElement.prototype.focus;
  let trapUntil = 0;
  let pageTop = 0;

  const pane = () => host.querySelector<HTMLElement>(".references-rendered");
  const sidebar = () => host.querySelector<HTMLElement>(".t-doc__sidebar");

  function arm() {
    trapUntil = performance.now() + 900;
    pageTop = document.scrollingElement?.scrollTop ?? window.scrollY;
  }

  function trapped() {
    return host.isConnected && performance.now() < trapUntil;
  }

  function pinFrame() {
    host.scrollTop = 0;
    const calls = pane();
    const side = sidebar();
    host.querySelectorAll<HTMLElement>(".scalar-app, .references-layout").forEach((el) => {
      if (el === calls || el === side) return;
      if (side?.contains(el) || calls?.contains(el)) return;
      el.scrollTop = 0;
    });
    const scroller = document.scrollingElement;
    if (trapped() && scroller && Math.abs(scroller.scrollTop - pageTop) > 1) {
      scroller.scrollTop = pageTop;
    }
  }

  function scrollCalls(target: Element, arg?: boolean | ScrollIntoViewOptions) {
    const calls = pane();
    if (!calls) return;
    const node = target === calls ? calls.firstElementChild : target;
    if (!(node instanceof HTMLElement)) return;
    const top =
      node.getBoundingClientRect().top -
      calls.getBoundingClientRect().top +
      calls.scrollTop -
      12;
    calls.scrollTo({
      top: Math.max(0, top),
      behavior:
        arg && typeof arg === "object" && arg.behavior === "smooth" ? "smooth" : "auto",
    });
  }

  function patchedScrollTo(this: Window, ...args: Parameters<Window["scrollTo"]>) {
    if (trapped()) {
      pinFrame();
      return;
    }
    nativeScrollTo(...args);
  }

  function patchedIntoView(this: Element, arg?: boolean | ScrollIntoViewOptions) {
    if (!host.isConnected || !host.contains(this)) {
      nativeIntoView.call(this, arg);
      return;
    }
    arm();
    const calls = pane();
    const side = sidebar();
    if (side && (this === side || side.contains(this))) {
      pinFrame();
      return;
    }
    if (calls && (this === calls || calls.contains(this))) {
      scrollCalls(this, arg);
      pinFrame();
      return;
    }
    nativeIntoView.call(this, arg);
    pinFrame();
  }

  function patchedFocus(this: HTMLElement, options?: FocusOptions) {
    if (host.isConnected && host.contains(this)) {
      arm();
      nativeFocus.call(this, { ...options, preventScroll: true });
      return;
    }
    nativeFocus.call(this, options);
  }

  function onHostPointer() {
    arm();
  }

  function onClick(event: Event) {
    const target = event.target;
    if (!(target instanceof Element) || !host.contains(target)) return;
    arm();
    requestAnimationFrame(pinFrame);
  }

  function onWindowScroll(event: Event) {
    const target = event.target;
    if (
      target !== document &&
      target !== document.documentElement &&
      target !== document.body
    ) {
      return;
    }
    if (!trapped()) return;
    const scroller = document.scrollingElement;
    if (scroller && Math.abs(scroller.scrollTop - pageTop) > 1) {
      scroller.scrollTop = pageTop;
    }
  }

  window.scrollTo = patchedScrollTo as typeof window.scrollTo;
  window.scroll = patchedScrollTo as typeof window.scroll;
  Element.prototype.scrollIntoView = patchedIntoView;
  HTMLElement.prototype.focus = patchedFocus;
  host.addEventListener("pointerdown", onHostPointer, true);
  host.addEventListener("click", onClick, true);
  window.addEventListener("scroll", onWindowScroll, true);
  pinFrame();

  return () => {
    if (window.scrollTo === (patchedScrollTo as typeof window.scrollTo)) {
      window.scrollTo = nativeScrollTo;
    }
    if (window.scroll === (patchedScrollTo as typeof window.scroll)) {
      window.scroll = nativeScroll;
    }
    if (Element.prototype.scrollIntoView === patchedIntoView) {
      Element.prototype.scrollIntoView = nativeIntoView;
    }
    if (HTMLElement.prototype.focus === patchedFocus) {
      HTMLElement.prototype.focus = nativeFocus;
    }
    host.removeEventListener("pointerdown", onHostPointer, true);
    host.removeEventListener("click", onClick, true);
    window.removeEventListener("scroll", onWindowScroll, true);
  };
}

function loadStandalone() {
  const existing = document.querySelector<HTMLScriptElement>(
    "script[data-scalar-standalone]",
  );
  if (existing) {
    return existing.dataset.loaded === "true"
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener(
            "error",
            () => reject(new Error("Scalar failed to load")),
            { once: true },
          );
        });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCALAR_STANDALONE_SRC;
    script.dataset.scalarStandalone = "true";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Scalar failed to load"));
    document.head.appendChild(script);
  });
}

export function DocsBotApiReferenceView({ spec }: { spec: OpenApiSpec }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => DEFAULT_THEME,
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    let cancelled = false;
    let instance: ScalarInstance | void;
    let observer: MutationObserver | undefined;
    let releasePin: (() => void) | undefined;
    const releaseHistory = guardHistory();
    let introFrame = 0;

    function watchSearch() {
      observer?.disconnect();
      observer = new MutationObserver((mutations) => {
        let intro = false;
        for (const mutation of mutations) {
          if (
            mutation.target instanceof Node &&
            hostRef.current?.contains(mutation.target)
          ) {
            intro = true;
          }
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) {
              continue;
            }
            hideIntroductionSearchRows(node);
            if (hostRef.current?.contains(node)) {
              intro = true;
            }
          }
        }
        if (!intro || introFrame) {
          return;
        }
        introFrame = window.requestAnimationFrame(() => {
          introFrame = 0;
          if (hostRef.current) {
            hideIntroductionNav(hostRef.current);
          }
        });
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    function mountReference(Scalar: ScalarGlobal) {
      if (cancelled || !hostRef.current) {
        return;
      }
      instance?.destroy?.();
      instance = Scalar.createApiReference(hostRef.current, {
        ...createScalarReferenceConfig(),
        content: spec,
        darkMode: theme === "dark",
        forceDarkModeState: theme,
        slug: "docs-chat",
      });
      if (cancelled) {
        instance?.destroy?.();
        return;
      }
      setMounted(true);
      hideIntroductionNav(hostRef.current);
      watchSearch();
      releasePin?.();
      releasePin = pinEmbed(hostRef.current);
    }

    const mountTimer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }
      loadStandalone()
        .then(() => {
          if (cancelled || !hostRef.current) {
            return;
          }
          const Scalar = (window as Window & { Scalar?: ScalarGlobal }).Scalar;
          if (!Scalar) {
            throw new Error("Scalar global is missing");
          }
          mountReference(Scalar);
        })
        .catch((error: unknown) => {
          if (!cancelled) {
            console.error(error);
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(mountTimer);
      if (introFrame) {
        window.cancelAnimationFrame(introFrame);
      }
      releaseHistory();
      releasePin?.();
      observer?.disconnect();
      setMounted(false);
      instance?.destroy?.();
      host.replaceChildren();
    };
  }, [spec, theme]);

  return (
    <div className="docs-bot-api">
      {!mounted ? <p className="docs-api-pending">Loading API reference…</p> : null}
      <div
        ref={hostRef}
        className="docs-bot-api-host"
        aria-busy={mounted ? undefined : true}
      />
    </div>
  );
}
