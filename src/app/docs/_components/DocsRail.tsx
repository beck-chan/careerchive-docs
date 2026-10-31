"use client";

import { usePathname } from "next/navigation";
import { DocsApiSearch } from "./DocsApiSearch";
import { DocsToc } from "./DocsToc";

export function DocsRail() {
  const pathname = usePathname();
  if (pathname === "/docs/api") {
    return <DocsApiSearch />;
  }
  return <DocsToc />;
}
