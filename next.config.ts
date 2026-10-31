import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const root = process.cwd();

const nextConfig: NextConfig = {
  agentRules: false,
  env: {
    FLAG_APP: process.env.FLAG_APP ?? "true",
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async rewrites() {
    return [
      {
        source: "/docs/:path*.md",
        destination: "/docs/raw/:path*",
      },
    ];
  },
};

const SNIPPET_WATCH_LOADER = path.join(
  root,
  "src/lib/mdx/snippet-watch-loader.cjs",
);

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",
      [path.join(root, "src/lib/mdx/remark-docs-syntax.mjs"), { rev: 9 }],
    ],
    rehypePlugins: [
      [path.join(root, "src/lib/mdx/rehype-docs-slug.mjs"), { rev: 2 }],
      [path.join(root, "src/lib/mdx/rehype-docs-highlight.mjs"), { rev: 2 }],
    ],
  },
});

function withSnippetWatch(config: NextConfig): NextConfig {
  const watchLoader = { loader: SNIPPET_WATCH_LOADER };
  const rules = config.turbopack?.rules;
  if (rules) {
    for (const [key, value] of Object.entries(rules)) {
      const list = Array.isArray(value) ? [...value] : [value];
      for (const rule of list) {
        if (
          rule &&
          typeof rule === "object" &&
          "loaders" in rule &&
          Array.isArray(rule.loaders)
        ) {
          rule.loaders = [...rule.loaders, watchLoader];
        }
      }
      rules[key] = Array.isArray(value) ? list : list[0];
    }
  }

  const prevWebpack = config.webpack;
  config.webpack = (webpackConfig, options) => {
    webpackConfig.module.rules.unshift({
      test: /\.mdx$/,
      enforce: "pre",
      loader: SNIPPET_WATCH_LOADER,
    });
    return typeof prevWebpack === "function"
      ? prevWebpack(webpackConfig, options)
      : webpackConfig;
  };

  return config;
}

export default withSnippetWatch(withMDX(nextConfig));
