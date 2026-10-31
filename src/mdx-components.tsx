import type { MDXComponents } from "mdx/types";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import Link from "next/link";
import { DocsApiExplorer } from "@/app/(site)/docs/_components/DocsApiExplorer";
import { DocsCallout } from "@/app/(site)/docs/_components/DocsCallout";
import { DocsCodeBlock } from "@/app/(site)/docs/_components/DocsCodeBlock";
import { DocsColumn, DocsColumns } from "@/app/(site)/docs/_components/DocsColumns";
import { DocsGear } from "@/app/(site)/docs/_components/DocsGear";
import { DocsLock } from "@/app/(site)/docs/_components/DocsLock";
import { DocsSnippetTab } from "@/app/(site)/docs/_components/DocsSnippetTab";
import { DocsTab, DocsTabset } from "@/app/(site)/docs/_components/DocsTabset";
import { DocsTaskItem } from "@/app/(site)/docs/_components/DocsTaskItem";
import { HomeFigureCycle } from "@/components/HomeFigureCycle";
import { HomeGalleryButton } from "@/components/HomeGalleryButton";
import { WordmarkText } from "@/components/WordmarkText";

function classNames(className: unknown) {
  if (Array.isArray(className)) {
    return className.filter(Boolean).map(String);
  }
  if (typeof className === "string") {
    return className.split(/\s+/).filter(Boolean);
  }
  return [];
}

function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function headingId(id: unknown, children: ReactNode) {
  if (typeof id === "string" && id) return id;
  return slugify(textOf(children));
}

function isCheckbox(node: ReactNode): node is ReactElement<{
  type?: string;
  checked?: boolean;
}> {
  return (
    isValidElement(node) &&
    node.type === "input" &&
    (node.props as { type?: string }).type === "checkbox"
  );
}

function extractTaskState(children: ReactNode) {
  let checked = false;

  const withoutCheckbox = (node: ReactNode): ReactNode => {
    if (isCheckbox(node)) {
      checked = Boolean((node.props as { checked?: boolean }).checked);
      return null;
    }
    if (!isValidElement(node)) {
      return node;
    }
    const nested = (node.props as { children?: ReactNode }).children;
    if (nested == null) {
      return node;
    }
    const next = Children.map(nested, withoutCheckbox);
    const kept = Children.toArray(next).filter((child) => child != null);
    if (kept.length === Children.count(nested)) {
      return node;
    }
    return cloneElement(node, undefined, kept);
  };

  const rest = Children.toArray(children)
    .map(withoutCheckbox)
    .filter((child) => child != null);

  return { checked, rest };
}

function isAppHref(href: unknown): href is string {
  return (
    typeof href === "string" &&
    (href.startsWith("/") || href.startsWith("#")) &&
    !href.startsWith("//")
  );
}

const components: MDXComponents = {
  a: ({ href, children, ...props }) => {
    if (props.target !== "_blank" && isAppHref(href)) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={typeof href === "string" ? href : undefined} {...props}>
        {children}
      </a>
    );
  },
  h1: ({ children, id, ...props }) => (
    <h1 {...props} id={headingId(id, children)} className="mdx-title">
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2 {...props} id={headingId(id, children)} className="mdx-heading">
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 {...props} id={headingId(id, children)} className="mdx-subheading">
      {children}
    </h3>
  ),
  pre: ({ children, className, ...props }) => (
    <DocsCodeBlock {...props} className={className}>
      {children}
    </DocsCodeBlock>
  ),
  table: ({ children, className, ...props }) => (
    <div className="docs-table-wrap">
      <table
        {...props}
        className={["docs-table", className].filter(Boolean).join(" ")}
      >
        {children}
      </table>
    </div>
  ),
  li: ({ children, className, ...props }) => {
    const names = classNames(className);
    const isTask = names.includes("task-list-item");
    if (isTask) {
      const task = extractTaskState(children);
      return (
        <DocsTaskItem
          defaultChecked={task.checked}
          className={["docs-list-item", ...names].filter(Boolean).join(" ")}
          {...props}
        >
          {task.rest}
        </DocsTaskItem>
      );
    }
    return (
      <li
        className={["docs-list-item", ...names].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
      </li>
    );
  },
  WordmarkText,
  HomeFigureCycle,
  HomeGalleryButton,
  DocsApiExplorer,
  DocsGear,
  DocsLock,
  DocsCallout,
  DocsColumns,
  DocsColumn,
  DocsTabset,
  DocsTab,
  DocsSnippetTab,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
