import { version as SCALAR_PACKAGE_VERSION } from "../../../node_modules/@scalar/api-reference/package.json";

export const SCALAR_CUSTOM_CSS = `
.scalar-app,
.scalar-app.light-mode,
.scalar-app.dark-mode {
  --scalar-font: var(--body-font, Jost, sans-serif);
  --scalar-font-code: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --scalar-color-1: var(--title, #1a1a1a);
  --scalar-color-2: var(--title-muted, #5c5c5c);
  --scalar-color-3: var(--title-muted, #5c5c5c);
  --scalar-color-accent: var(--blossom-soft, #8b5c7e);
  --scalar-background-1: var(--page, #ffffff);
  --scalar-background-2: var(--page, #ffffff);
  --scalar-background-3: var(--field, #fcfcfc);
  --scalar-sidebar-background-1: var(--page, #ffffff);
  --scalar-sidebar-border-color: var(--blossom-pink, #d39aab);
  --scalar-sidebar-indent-border: var(--blossom-pink, #d39aab);
  --scalar-sidebar-indent-border-hover: var(--blossom-pink, #d39aab);
  --scalar-sidebar-indent-border-active: var(--blossom-pink, #d39aab);
  --scalar-border-color: var(--blossom-pink, #d39aab);
  --scalar-button-1: var(--chive, #61683b);
  --scalar-button-1-hover: var(--chive-soft, #9da762);
  --scalar-button-1-color: #ffffff;
  --scalar-content-max-width: 1540px;
  --refs-content-max-width: 100%;
}

html[data-theme="dark"] .scalar-app,
html[data-theme="dark"] .scalar-app.dark-mode,
html[data-theme="dark"] .scalar-app.light-mode {
  --scalar-color-1: var(--soft-white, #fcfcfc);
  --scalar-color-2: var(--blossom-hot, #c6b6cd);
  --scalar-color-3: var(--blossom-hot, #c6b6cd);
  --scalar-color-accent: var(--blossom-hot, #c6b6cd);
  --scalar-background-1: var(--page, #4f263d);
  --scalar-background-2: var(--page, #4f263d);
  --scalar-background-3: var(--field, #8b5c7e);
  --scalar-sidebar-background-1: var(--page, #4f263d);
  --scalar-sidebar-border-color: var(--blossom-pink, #d39aab);
  --scalar-sidebar-indent-border: var(--blossom-pink, #d39aab);
  --scalar-sidebar-indent-border-hover: var(--blossom-pink, #d39aab);
  --scalar-sidebar-indent-border-active: var(--blossom-pink, #d39aab);
  --scalar-border-color: var(--blossom-pink, #d39aab);
  --scalar-button-1: var(--chive, #c5cba3);
  --scalar-button-1-hover: var(--chive-hot, #c5cba3);
  --scalar-button-1-color: #4f263d;
}

.scalar-app,
.scalar-app *:not(code):not(pre):not(.hljs):not(h3) {
  font-family: var(--body-font, Jost, sans-serif) !important;
}

.scalar-app code,
.scalar-app pre,
.scalar-app .hljs,
.scalar-app code *,
.scalar-app pre *,
.scalar-app .hljs *,
.scalar-app .cm-editor,
.scalar-app .cm-editor * {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace !important;
}

.scalar-app .introduction-section > h1,
.scalar-app .introduction-section h1,
.scalar-app .introduction h1 {
  display: none !important;
}

.scalar-app .introduction-section,
.scalar-app .introduction,
.scalar-app [id="description"] {
  padding-top: 0.85rem !important;
  margin-top: 0 !important;
}

.scalar-app .markdown h3,
.scalar-app .introduction-section h3,
.scalar-app .introduction h3,
.scalar-app .tag-name,
.scalar-app .section-header,
.scalar-app .section-header h1,
.scalar-app .section-header h2,
.scalar-app .section-header h3,
.scalar-app .section-header a,
.scalar-app .references-rendered h2,
.scalar-app .references-rendered h3 {
  scroll-margin-top: 1.25rem !important;
  color: var(--blossom-soft, #8b5c7e) !important;
}

.scalar-app .markdown h3,
.scalar-app .introduction-section h3,
.scalar-app .introduction h3 {
  margin: 1.75rem 0 0 !important;
  font-size: clamp(1.35rem, 2vw, 1.7rem) !important;
  font-weight: 400 !important;
  letter-spacing: 0.02em !important;
  line-height: 1.2 !important;
}

html[data-theme="dark"] .scalar-app .markdown h3,
html[data-theme="dark"] .scalar-app .introduction-section h3,
html[data-theme="dark"] .scalar-app .introduction h3,
html[data-theme="dark"] .scalar-app .tag-name,
html[data-theme="dark"] .scalar-app .section-header,
html[data-theme="dark"] .scalar-app .section-header h1,
html[data-theme="dark"] .scalar-app .section-header h2,
html[data-theme="dark"] .scalar-app .section-header h3,
html[data-theme="dark"] .scalar-app .section-header a,
html[data-theme="dark"] .scalar-app .references-rendered h2,
html[data-theme="dark"] .scalar-app .references-rendered h3 {
  color: var(--blossom-hot, #c6b6cd) !important;
}

.scalar-app .introduction-section p,
.scalar-app .introduction-section .markdown p,
.scalar-app .introduction p {
  font-size: 1.2em !important;
  line-height: 1.35 !important;
}

/* Iframe is usually < 1000px, where Scalar stacks the layout. The layout
   node is scalar-app.references-layout (same element), so a descendant
   selector never matches. Keep two columns. */
.scalar-app,
.scalar-app.scalar-api-reference,
.scalar-app.references-layout {
  --scalar-header-height: 0px;
  --full-height: 100%;
  --refs-header-height: 0px;
  --refs-sidebar-width: var(--scalar-sidebar-width, 288px);
  --refs-sidebar-height: 100%;
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
}

.scalar-app.references-layout,
.scalar-app.scalar-api-reference {
  overflow: hidden !important;
  display: grid !important;
  grid-template-columns: var(--refs-sidebar-width) minmax(0, 1fr) !important;
  grid-template-rows: minmax(0, 1fr) !important;
  grid-template-areas: "navigation rendered" !important;
}

@media (width < 1000px) {
  .scalar-app.references-layout,
  .scalar-app.scalar-api-reference,
  .scalar-app.scalar-api-references-standalone-mobile {
    --scalar-header-height: 0px !important;
    grid-template-columns: var(--refs-sidebar-width) minmax(0, 1fr) !important;
    grid-template-rows: minmax(0, 1fr) !important;
    grid-template-areas: "navigation rendered" !important;
  }
}

html[data-layout="mobile"] .scalar-app.references-layout,
html[data-layout="mobile"] .scalar-app.scalar-api-reference,
html[data-layout="mobile"] .scalar-app.scalar-api-references-standalone-mobile {
  grid-template-columns: minmax(0, 1fr) !important;
  grid-template-areas: "rendered" !important;
}

html[data-layout="mobile"] .scalar-app .t-doc__sidebar {
  display: none !important;
}

html[data-layout="mobile"] .scalar-app .references-rendered {
  --calls-pad-x: 1.15rem;
  grid-area: rendered !important;
  padding-top: 1.75rem !important;
  padding-left: var(--calls-pad-x) !important;
  padding-right: var(--calls-pad-x) !important;
}

html.sidebar-overlay-open .scalar-app,
html.sidebar-overlay-open .scalar-app.references-layout,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app.references-layout {
  position: relative !important;
  grid-template-rows: minmax(0, 1fr) !important;
  grid-auto-rows: 0 !important;
}

html.sidebar-overlay-open .scalar-app .t-doc__sidebar,
html.sidebar-overlay-open .scalar-app aside.t-doc__sidebar,
html.sidebar-overlay-open .scalar-app aside.hidden,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app .t-doc__sidebar,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app aside.t-doc__sidebar,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app aside.hidden {
  display: flex !important;
  flex-direction: column !important;
  visibility: visible !important;
  position: fixed !important;
  top: 0 !important;
  right: auto !important;
  bottom: 0 !important;
  left: 0 !important;
  z-index: 40 !important;
  grid-area: unset !important;
  width: min(18.5rem, 86vw) !important;
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  transform: none !important;
  box-shadow: 0.45rem 0 1.4rem rgb(26 26 26 / 0.28);
}

html.sidebar-overlay-open .scalar-app .t-doc__sidebar > .flex-1,
html.sidebar-overlay-open .scalar-app .t-doc__sidebar .darklight-reference,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app .t-doc__sidebar > .flex-1,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app .t-doc__sidebar .darklight-reference {
  display: none !important;
  flex: 0 0 0 !important;
  height: 0 !important;
  min-height: 0 !important;
  overflow: hidden !important;
}

html.sidebar-overlay-open .scalar-app .t-doc__sidebar > .custom-scroll,
html.sidebar-overlay-open .scalar-app .t-doc__sidebar > ul,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app .t-doc__sidebar > .custom-scroll,
html[data-layout="mobile"].sidebar-overlay-open .scalar-app .t-doc__sidebar > ul {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  height: auto !important;
  max-height: none !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  margin: 0 !important;
  background: var(--page) !important;
}

#api-sidebar-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 35;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgb(26 26 26 / 0.42);
  cursor: pointer;
}

html.sidebar-overlay-open #api-sidebar-backdrop {
  display: block !important;
}

.scalar-app .t-doc__sidebar {
  display: flex !important;
  visibility: visible !important;
  flex-direction: column !important;
  grid-area: navigation !important;
  position: relative !important;
  inset: auto !important;
  top: auto !important;
  bottom: auto !important;
  left: auto !important;
  right: auto !important;
  align-self: stretch !important;
  width: var(--refs-sidebar-width) !important;
  height: 100% !important;
  max-height: 100% !important;
  min-height: 0 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  transform: none !important;
  background: var(--page, #ffffff) !important;
  border-right: 1px solid var(--blossom-pink, #d39aab) !important;
  border-color: var(--blossom-pink, #d39aab) !important;
  --scalar-sidebar-item-hover-background: var(--entry, #fafafa);
  --scalar-sidebar-item-active-background: var(--entry, #fafafa);
}

html[data-theme="dark"] .scalar-app .t-doc__sidebar {
  background: var(--page, #4f263d) !important;
  --scalar-sidebar-item-hover-background: var(--entry);
  --scalar-sidebar-item-active-background: var(--entry);
}

.scalar-app .t-doc__sidebar .custom-scroll {
  transform: none !important;
  flex: 1 1 auto !important;
  min-height: 0 !important;
}

.scalar-app .t-doc__sidebar,
.scalar-app .t-doc__sidebar * {
  border-color: var(--blossom-pink, #d39aab) !important;
}

.scalar-app .t-doc__sidebar .sidebar-heading-type,
.scalar-app .t-doc__sidebar .sidebar-heading-type * {
  border-color: currentColor !important;
}

.scalar-app .t-doc__sidebar a,
.scalar-app .t-doc__sidebar button,
.scalar-app .t-doc__sidebar .sidebar-heading,
.scalar-app .t-doc__sidebar .text-sidebar-c-2,
.scalar-app .t-doc__sidebar .text-sidebar-c-1 {
  color: var(--blossom, #4f263d) !important;
}

.scalar-app .t-doc__sidebar a:hover,
.scalar-app .t-doc__sidebar button:hover,
.scalar-app .t-doc__sidebar .sidebar-heading:hover,
.scalar-app .t-doc__sidebar a:hover .text-sidebar-c-2,
.scalar-app .t-doc__sidebar button:hover .text-sidebar-c-2 {
  color: var(--blossom-soft, #8b5c7e) !important;
}

html[data-theme="dark"] .scalar-app .t-doc__sidebar a,
html[data-theme="dark"] .scalar-app .t-doc__sidebar button,
html[data-theme="dark"] .scalar-app .t-doc__sidebar .sidebar-heading,
html[data-theme="dark"] .scalar-app .t-doc__sidebar .text-sidebar-c-2,
html[data-theme="dark"] .scalar-app .t-doc__sidebar .text-sidebar-c-1 {
  color: #c6b6cd !important;
}

html[data-theme="dark"] .scalar-app .t-doc__sidebar a:hover,
html[data-theme="dark"] .scalar-app .t-doc__sidebar button:hover,
html[data-theme="dark"] .scalar-app .t-doc__sidebar .sidebar-heading:hover,
html[data-theme="dark"] .scalar-app .t-doc__sidebar a:hover .text-sidebar-c-2,
html[data-theme="dark"] .scalar-app .t-doc__sidebar button:hover .text-sidebar-c-2 {
  color: var(--soft-white, #fcfcfc) !important;
}

.scalar-app .t-doc__sidebar a:hover,
.scalar-app .t-doc__sidebar button:hover,
.scalar-app .t-doc__sidebar .sidebar-heading:hover,
.scalar-app .t-doc__sidebar .bg-sidebar-b-active,
.scalar-app .t-doc__sidebar [aria-current="true"],
.scalar-app .t-doc__sidebar [aria-current="page"] {
  background-color: var(--entry, #fafafa) !important;
}

html[data-theme="dark"] .scalar-app .t-doc__sidebar a:hover,
html[data-theme="dark"] .scalar-app .t-doc__sidebar button:hover,
html[data-theme="dark"] .scalar-app .t-doc__sidebar .sidebar-heading:hover,
html[data-theme="dark"] .scalar-app .t-doc__sidebar .bg-sidebar-b-active,
html[data-theme="dark"] .scalar-app .t-doc__sidebar [aria-current="true"],
html[data-theme="dark"] .scalar-app .t-doc__sidebar [aria-current="page"] {
  background-color: var(--entry) !important;
}

.scalar-app .t-doc__sidebar .sidebar-heading-type,
.scalar-app .t-doc__sidebar .sidebar-heading-type * {
  color: var(--method-color, inherit) !important;
}

.scalar-app .t-doc__sidebar [data-sidebar-id*="description"],
.scalar-app .t-doc__sidebar li:has(> a[href^="#description"]) {
  display: none !important;
}

.scalar-app .t-doc__header,
.scalar-app .references-footer,
.scalar-app a[href*="scalar.com"],
.scalar-app .agent-scalar,
.scalar-app .agent-scalar-overlay,
.scalar-app .agent-button-container,
.scalar-app .bg-sidebar-b-search,
.scalar-app [class*="sidebar-search"],
.scalar-app .t-doc__sidebar :has(> .bg-sidebar-b-search) {
  display: none !important;
}

.scalar-app .references-rendered {
  --calls-pad-x: 2.5rem;
  grid-area: rendered !important;
  position: relative !important;
  min-width: 0 !important;
  min-height: 0 !important;
  height: 100% !important;
  max-height: 100% !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  padding-top: 1.75rem !important;
  padding-left: var(--calls-pad-x) !important;
  padding-right: var(--calls-pad-x) !important;
  background: var(--entry, #fafafa) !important;
  --scalar-background-1: var(--entry, #fafafa);
  --scalar-background-2: var(--entry, #fafafa);
  --scalar-background-3: var(--entry, #fafafa);
}

html[data-theme="dark"] .scalar-app .references-rendered {
  background: var(--entry) !important;
  --scalar-background-1: var(--entry);
  --scalar-background-2: var(--entry);
  --scalar-background-3: var(--entry);
}

.scalar-app .property-default-value,
.scalar-app .property-example-value {
  background: #4f263d !important;
  color: #c6b6cd !important;
  border-color: var(--blossom-pink, #d39aab) !important;
}

html[data-theme="dark"] .scalar-app .property-default-value,
html[data-theme="dark"] .scalar-app .property-example-value {
  background: #000000 !important;
}

.scalar-app .section-container {
  box-sizing: border-box !important;
  padding-inline: 0 !important;
  margin-inline: calc(-1 * var(--calls-pad-x, 2.5rem)) !important;
  width: calc(100% + 2 * var(--calls-pad-x, 2.5rem)) !important;
  max-width: none !important;
}

.scalar-app .section,
.scalar-app .introduction-section,
.scalar-app .introduction {
  box-sizing: border-box !important;
  margin-inline: 0 !important;
  max-width: 100% !important;
  padding-inline: var(--calls-pad-x, 2.5rem) !important;
}

/* Same regions CareerChive fills (example card, response well), CareerChive docs-code tokens. */
.scalar-app .scalar-card.dark-mode {
  --scalar-background-1: #4f263d;
  --scalar-background-2: #4f263d;
  --scalar-background-3: #4f263d;
  --scalar-color-1: #c6b6cd;
  --scalar-color-2: #c6b6cd;
  --scalar-color-3: #c6b6cd;
  background: #4f263d !important;
  color: #c6b6cd !important;
  border-color: var(--blossom-pink, #d39aab) !important;
}

html[data-theme="dark"] .scalar-app .scalar-card.dark-mode {
  --scalar-background-1: #000000;
  --scalar-background-2: #000000;
  --scalar-background-3: #000000;
  background: #000000 !important;
  border-color: #1a1a1a !important;
}

.scalar-app .response-card {
  background: var(--page, #ffffff) !important;
  border-color: var(--blossom-pink, #d39aab) !important;
}

html[data-theme="dark"] .scalar-app .response-card {
  background: var(--page, #4f263d) !important;
}

.scalar-app .response-card .scalar-card-header,
.scalar-app .response-card .scalar-card-footer,
.scalar-app .response-card .response-card-footer {
  background: var(--page, #ffffff) !important;
  color: var(--title, #1a1a1a) !important;
  border-color: var(--blossom-pink, #d39aab) !important;
}

html[data-theme="dark"] .scalar-app .response-card .scalar-card-header,
html[data-theme="dark"] .scalar-app .response-card .scalar-card-footer,
html[data-theme="dark"] .scalar-app .response-card .response-card-footer {
  background: var(--page, #4f263d) !important;
  color: var(--title, #c6b6cd) !important;
}

.scalar-app .response-card > .scalar-card-content.grid,
.scalar-app .response-card .scalar-code-block,
.scalar-app .scalar-card.dark-mode .scalar-code-block {
  background: #4f263d !important;
}

html[data-theme="dark"] .scalar-app .response-card > .scalar-card-content.grid,
html[data-theme="dark"] .scalar-app .response-card .scalar-code-block,
html[data-theme="dark"] .scalar-app .scalar-card.dark-mode .scalar-code-block {
  background: #000000 !important;
}

.scalar-app code.hljs,
.scalar-app .hljs,
.scalar-app pre {
  background: #4f263d !important;
  color: #c6b6cd !important;
}

html[data-theme="dark"] .scalar-app code.hljs,
html[data-theme="dark"] .scalar-app .hljs,
html[data-theme="dark"] .scalar-app pre {
  background: #000000 !important;
  color: #c6b6cd !important;
}

.scalar-app .response-card .scalar-code-block pre,
.scalar-app .response-card .scalar-code-block code.hljs,
.scalar-app .response-card .scalar-code-block .hljs,
.scalar-app .scalar-card.dark-mode .scalar-code-block pre,
.scalar-app .scalar-card.dark-mode .scalar-code-block code.hljs,
.scalar-app .scalar-card.dark-mode .scalar-code-block .hljs {
  background: transparent !important;
}

.scalar-app .text-c-3.flex.min-h-10,
.scalar-app .text-c-3.flex.items-center.justify-center,
.scalar-app .scalar-card.dark-mode .text-c-3 {
  color: #c6b6cd !important;
}

.scalar-app .scalar-code-copy,
.scalar-app .code-copy,
.scalar-app .scalar-code-copy-backdrop {
  background: var(--page, #ffffff) !important;
  color: var(--blossom-pink, #d39aab) !important;
  border-radius: 0.35rem;
  padding-top: 0;
}

html[data-theme="dark"] .scalar-app .scalar-code-copy,
html[data-theme="dark"] .scalar-app .code-copy,
html[data-theme="dark"] .scalar-app .scalar-code-copy-backdrop {
  background: var(--page, #4f263d) !important;
  color: var(--blossom-hot, #c6b6cd) !important;
}

.scalar-app .scalar-code-copy svg,
.scalar-app .code-copy svg,
.scalar-app .scalar-code-copy *:not(.scalar-code-copy-backdrop),
.scalar-app .code-copy *:not(.scalar-code-copy-backdrop) {
  color: var(--blossom-pink, #d39aab) !important;
  fill: var(--blossom-pink, #d39aab) !important;
}

html[data-theme="dark"] .scalar-app .scalar-code-copy svg,
html[data-theme="dark"] .scalar-app .code-copy svg,
html[data-theme="dark"] .scalar-app .scalar-code-copy *:not(.scalar-code-copy-backdrop),
html[data-theme="dark"] .scalar-app .code-copy *:not(.scalar-code-copy-backdrop) {
  color: var(--blossom-hot, #c6b6cd) !important;
  fill: var(--blossom-hot, #c6b6cd) !important;
}

.scalar-app .hljs-comment,
.scalar-app .hljs-quote {
  color: #8b5c7e !important;
  font-style: italic;
}

.scalar-app .hljs-keyword,
.scalar-app .hljs-selector-tag,
.scalar-app .hljs-literal,
.scalar-app .hljs-built_in,
.scalar-app .hljs-builtin-name {
  color: #c5cba3 !important;
}

.scalar-app .hljs-string,
.scalar-app .hljs-title,
.scalar-app .hljs-name,
.scalar-app .hljs-type,
.scalar-app .hljs-section,
.scalar-app .hljs-regexp {
  color: #d39aab !important;
}

.scalar-app .hljs-attr,
.scalar-app .hljs-attribute,
.scalar-app .hljs-variable,
.scalar-app .hljs-template-variable,
.scalar-app .hljs-params {
  color: #c6b6cd !important;
}

.scalar-app .hljs-number,
.scalar-app .hljs-symbol,
.scalar-app .hljs-bullet,
.scalar-app .hljs-link,
.scalar-app .hljs-meta,
.scalar-app .hljs-title.function_ {
  color: #d39aab !important;
}

.scalar-app .cm-editor,
.scalar-app .cm-scroller,
.scalar-app .cm-gutters,
.scalar-app .cm-content {
  background: #4f263d !important;
  color: #c6b6cd !important;
  --scalar-background-1: #4f263d;
  --scalar-background-2: #4f263d;
  --scalar-background-3: #4f263d;
  --scalar-color-1: #c6b6cd;
  --scalar-color-2: #c6b6cd;
  --scalar-color-3: #8b5c7e;
  --scalar-color-blue: #d39aab;
  --scalar-color-green: #c5cba3;
  --scalar-color-orange: #d39aab;
  --scalar-color-purple: #c5cba3;
}

html[data-theme="dark"] .scalar-app .cm-editor,
html[data-theme="dark"] .scalar-app .cm-scroller,
html[data-theme="dark"] .scalar-app .cm-gutters,
html[data-theme="dark"] .scalar-app .cm-content {
  background: #000000 !important;
  --scalar-background-1: #000000;
  --scalar-background-2: #000000;
  --scalar-background-3: #000000;
}

.scalar-app .cm-gutters {
  border: 0 !important;
}

.scalar-app .cm-gutterElement,
.scalar-app .cm-lineNumbers .cm-gutterElement {
  color: #8b5c7e !important;
}

.scalar-app .cm-editor .tok-string,
.scalar-app .cm-editor .cm-string,
.scalar-app .cm-string {
  color: #d39aab !important;
}

.scalar-app .cm-editor .tok-propertyName,
.scalar-app .cm-editor .tok-attributeName,
.scalar-app .cm-editor .tok-variableName,
.scalar-app .cm-property {
  color: #c6b6cd !important;
}

.scalar-app .cm-editor .tok-keyword,
.scalar-app .cm-editor .tok-bool,
.scalar-app .cm-editor .tok-atom,
.scalar-app .cm-editor .tok-literal,
.scalar-app .cm-keyword {
  color: #c5cba3 !important;
}

.scalar-app .cm-editor .tok-number,
.scalar-app .cm-number {
  color: #d39aab !important;
}

.scalar-app .cm-editor .tok-punctuation,
.scalar-app .cm-editor .tok-bracket,
.scalar-app .cm-editor .tok-separator,
.scalar-app .cm-bracket,
.scalar-app .cm-punctuation {
  color: #c6b6cd !important;
}

.scalar-app,
.scalar-app * {
  scrollbar-width: thin !important;
  scrollbar-color: var(--blossom-hot, #c6b6cd) transparent !important;
}

.scalar-app::-webkit-scrollbar,
.scalar-app *::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}

.scalar-app::-webkit-scrollbar-track,
.scalar-app *::-webkit-scrollbar-track {
  background: transparent !important;
}

.scalar-app::-webkit-scrollbar-thumb,
.scalar-app *::-webkit-scrollbar-thumb {
  background-color: var(--blossom-hot, #c6b6cd) !important;
  border-radius: 999px !important;
}
`;

export const SCALAR_STANDALONE_SRC =
  `/docs/api/scalar-standalone?v=${SCALAR_PACKAGE_VERSION}`;

export function createScalarReferenceConfig() {
  return {
    layout: "modern" as const,
    theme: "none" as const,
    hideClientButton: true,
    defaultOpenFirstTag: false,
    hideSearch: true,
    showOperationId: true,
    showSidebar: true,
    expandAllResponses: true,
    showDeveloperTools: "never" as const,
    operationTitleSource: "summary" as const,
    persistAuth: false,
    authentication: {
      preferredSecurityScheme: "apikey",
    },
    isEditable: false,
    hideModels: true,
    documentDownloadType: "none" as const,
    hideTestRequestButton: true,
    hideDarkModeToggle: true,
    withDefaultFonts: false,
    slug: "api",
    defaultOpenAllTags: false,
    expandAllModelSections: false,
    expandAllSchemaProperties: false,
    orderSchemaPropertiesBy: "alpha" as const,
    orderRequiredPropertiesFirst: true,
    modelsSectionLabel: "Models",
    customCss: SCALAR_CUSTOM_CSS,
    urlRouting: false,
    localization: {
      translations: {
        search: {
          placeholder: "Search API",
        },
        footer: {
          poweredByScalar: "",
        },
      },
    },
  };
}
