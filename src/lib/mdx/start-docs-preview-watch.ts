import fs from "node:fs";
import path from "node:path";

const STARTED = Symbol.for("career-chive.docs-preview-watch");
const WATCH_INTERVAL_MS = 300;

function listFiles(dir: string, out: string[]) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(full, out);
      continue;
    }
    if (/\.(mdx?|mjs|cjs|js|ts|tsx|css)$/i.test(entry.name)) {
      out.push(full);
    }
  }
}

function snapshot(root: string) {
  const files = [
    path.join(root, "src", "mdx-components.tsx"),
    path.join(root, "src", "app", "globals.css"),
    path.join(root, "next.config.ts"),
  ];
  listFiles(path.join(root, "src", "app", "(site)", "docs"), files);
  listFiles(path.join(root, "src", "lib", "mdx"), files);
  listFiles(path.join(root, "src", "lib", "docs"), files);

  const map = new Map<string, number>();
  for (const file of files) {
    try {
      map.set(file, fs.statSync(file).mtimeMs);
    } catch {
      // File may have been deleted between list and stat.
    }
  }
  return map;
}

function writeTick(root: string) {
  const dir = path.join(root, ".next");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "docs-watch-tick"),
    `${Date.now()}\n${Math.random()}\n`,
  );
}

export function startDocsPreviewWatch(root = process.cwd()) {
  const g = globalThis as typeof globalThis & {
    [STARTED]?: boolean;
  };
  if (g[STARTED]) {
    return;
  }
  g[STARTED] = true;

  let last = snapshot(root);
  writeTick(root);

  setInterval(() => {
    const next = snapshot(root);
    let changed = next.size !== last.size;
    if (!changed) {
      for (const [file, mtime] of next) {
        if (last.get(file) !== mtime) {
          changed = true;
          break;
        }
      }
    }
    last = next;
    if (changed) {
      writeTick(root);
    }
  }, WATCH_INTERVAL_MS).unref();
}
