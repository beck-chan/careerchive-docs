import {
  SCALAR_STANDALONE_SRC,
  createScalarReferenceConfig,
} from "@/lib/docs/scalarConfig";
import { loadDatabaseOpenApiOrNull } from "@/lib/docs/loadDatabaseOpenApi";

export const dynamic = "force-dynamic";

function escapeJson(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function explorerHtml(specJson: string, configJson: string, mobile: boolean) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Library</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=block" rel="stylesheet" />
  <style>
    :root {
      --body-font: Jost, sans-serif;
      --page: #ffffff;
      --entry: #fafafa;
      --title: #1a1a1a;
      --title-muted: #5c5c5c;
      --chive: #61683b;
      --chive-soft: #9da762;
      --chive-hot: #c5cba3;
      --blossom: #4f263d;
      --blossom-soft: #8b5c7e;
      --blossom-hot: #c6b6cd;
      --blossom-pink: #d39aab;
      --field: #fcfcfc;
      --soft-white: #fcfcfc;
    }
    html[data-theme="dark"] {
      color-scheme: dark;
      --page: #4f263d;
      --entry: color-mix(in srgb, #4f263d 55%, #1a1a1a);
      --title: #c6b6cd;
      --title-muted: #d39aab;
      --chive: #c5cba3;
      --chive-soft: #9da762;
      --chive-hot: #c5cba3;
      --blossom: #d39aab;
      --blossom-soft: #c6b6cd;
      --blossom-hot: #c6b6cd;
      --blossom-pink: #d39aab;
      --field: #8b5c7e;
      --soft-white: color-mix(in srgb, #c6b6cd 32%, #fcfcfc);
    }
    html, body, #app {
      margin: 0;
      height: 100%;
      max-height: 100%;
      overflow: hidden !important;
      overscroll-behavior: none;
      background: var(--page);
      color: var(--title);
      font-family: var(--body-font);
      scrollbar-width: thin;
      scrollbar-color: var(--blossom-hot) transparent;
    }
    #app {
      display: flex;
      flex-direction: column;
    }
    #app > * {
      flex: 1 1 auto;
      min-height: 0;
      height: 100%;
      max-height: 100%;
      overflow: hidden;
    }
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--blossom-hot) transparent;
    }
    *::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    *::-webkit-scrollbar-track {
      background: transparent;
    }
    *::-webkit-scrollbar-thumb {
      background-color: var(--blossom-hot);
      border-radius: 999px;
    }
  </style>
  <script>
    (function () {
      var params = new URLSearchParams(location.search);
      var theme = params.get("theme");
      if (theme !== "light" && theme !== "dark") theme = "dark";
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;
      window.__DOCS_THEME__ = theme;
      var mobile = ${mobile ? "true" : "false"};
      try {
        if (!mobile && parent !== window && parent.matchMedia("(max-width: 900px)").matches) {
          mobile = true;
        }
      } catch (err) {}
      if (mobile) document.documentElement.setAttribute("data-layout", "mobile");
    })();
  </script>
</head>
<body>
  <div id="app"></div>
  <button type="button" id="api-sidebar-backdrop" hidden aria-label="Close API sidebar"></button>
  <script>window.__OPENAPI__ = ${specJson};</script>
  <script>window.__SCALAR_CONFIG__ = ${configJson};</script>
  <script src="${SCALAR_STANDALONE_SRC}"></script>
  <script>
    window.__SCALAR_CONFIG__.content = window.__OPENAPI__;
    window.__SCALAR_CONFIG__.darkMode = window.__DOCS_THEME__ === "dark";
    window.__SCALAR_CONFIG__.forceDarkModeState = window.__DOCS_THEME__;
    window.Scalar.createApiReference("#app", window.__SCALAR_CONFIG__);

    (function pinSidebar() {
      function pane() {
        return document.querySelector(".references-rendered");
      }
      function sidebar() {
        return document.querySelector(".t-doc__sidebar");
      }
      function isPinnedScroller(el) {
        return el === pane() || el === sidebar() || (el && el.closest && el.closest(".t-doc__sidebar"));
      }
      const nativeScrollTo = window.scrollTo.bind(window);
      function pinFrame() {
        nativeScrollTo(0, 0);
        [document.documentElement, document.body, document.getElementById("app")].forEach(function (el) {
          if (el) el.scrollTop = 0;
        });
        document.querySelectorAll(".scalar-app, .references-layout").forEach(function (el) {
          if (!isPinnedScroller(el)) el.scrollTop = 0;
        });
      }
      window.scrollTo = function () {
        pinFrame();
      };
      window.scroll = function () {
        pinFrame();
      };
      window.addEventListener("scroll", pinFrame, true);
      window.addEventListener("hashchange", pinFrame);
      document.addEventListener(
        "click",
        function () {
          requestAnimationFrame(pinFrame);
        },
        true,
      );
      const original = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (arg) {
        const calls = pane();
        if (this.closest && this.closest(".t-doc__sidebar")) {
          pinFrame();
          return;
        }
        if (calls && (this === calls || calls.contains(this))) {
          const target = this === calls ? calls.firstElementChild : this;
          if (target) {
            const top =
              target.getBoundingClientRect().top -
              calls.getBoundingClientRect().top +
              calls.scrollTop -
              12;
            calls.scrollTo({
              top: Math.max(0, top),
              behavior:
                arg && typeof arg === "object" && arg.behavior === "smooth"
                  ? "smooth"
                  : "auto",
            });
          }
          pinFrame();
          return;
        }
        original.call(this, arg);
        pinFrame();
      };
      pinFrame();
    })();

    (function sidebarOverlay() {
      var MSG = "careerchive-api-sidebar";
      var backdrop = document.getElementById("api-sidebar-backdrop");
      function setOpen(open) {
        var root = document.documentElement;
        if (open) root.setAttribute("data-layout", "mobile");
        root.classList.toggle("sidebar-overlay-open", open);
        if (backdrop) backdrop.hidden = !open;
      }
      window.addEventListener("message", function (event) {
        if (event.data && event.data.type === MSG) setOpen(!!event.data.open);
      });
      if (backdrop) {
        backdrop.addEventListener("click", function () {
          setOpen(false);
          try {
            parent.postMessage({ type: MSG, open: false }, "*");
          } catch (err) {}
        });
      }
      document.addEventListener(
        "click",
        function (event) {
          if (!document.documentElement.classList.contains("sidebar-overlay-open")) return;
          var target = event.target;
          if (!target || !target.closest) return;
          var link = target.closest(".t-doc__sidebar a[href]");
          if (!link) return;
          requestAnimationFrame(function () {
            setOpen(false);
            try {
              parent.postMessage({ type: MSG, open: false }, "*");
            } catch (err) {}
          });
        },
        true,
      );
    })();
  </script>
</body>
</html>`;
}

function explorerErrorHtml(message: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Library</title>
  <style>
    html, body {
      margin: 0;
      min-height: 100%;
      background: color-mix(in srgb, #4f263d 55%, #1a1a1a);
      color: #c6b6cd;
      font-family: Jost, sans-serif;
    }
    main {
      box-sizing: border-box;
      padding: 1.35rem 0.4rem;
    }
    h1 {
      margin: 0 0 0.65rem;
      font-size: 1.2rem;
      font-weight: 500;
    }
    p { margin: 0; line-height: 1.45; }
  </style>
</head>
<body>
  <main>
    <h1>API catalog could not be loaded</h1>
    <p>${message.replace(/</g, "&lt;")}</p>
  </main>
</body>
</html>`;
}

export async function GET(request: Request) {
  const mobile = new URL(request.url).searchParams.get("mobile") === "1";
  const catalog = await loadDatabaseOpenApiOrNull();
  if (!catalog.spec) {
    return new Response(explorerErrorHtml(catalog.error ?? "OpenAPI fetch failed"), {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const specJson = escapeJson(catalog.spec);
  const configJson = escapeJson(createScalarReferenceConfig());

  return new Response(explorerHtml(specJson, configJson, mobile), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
