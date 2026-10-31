"use strict";

const fs = require("node:fs");
const path = require("node:path");

function listFiles(dir, out) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(full, out);
    } else {
      out.push(full);
    }
  }
}

module.exports = function snippetWatchLoader(source) {
  const root = this.rootContext || process.cwd();
  const snippetsDir = path.join(
    root,
    "src",
    "app",
    "docs",
    "(article)",
    "_snippets",
  );

  if (typeof this.addContextDependency === "function") {
    this.addContextDependency(snippetsDir);
  }

  const files = [];
  listFiles(snippetsDir, files);
  for (const file of files) {
    if (typeof this.addDependency === "function") {
      this.addDependency(file);
    }
  }

  return source;
};
