export type DocsNavItem = {
  label: string;
  href: string;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
  collapsible?: boolean;
};

export const DOCS_NAV_SECTIONS: DocsNavSection[] = [
  {
    title: "Installation",
    items: [
      { label: "Prerequisites", href: "/docs/prerequisites" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "Install with npm", href: "/docs/install" },
      { label: "Enable ChiveBot", href: "/docs/chatbot" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Settings & Organizations", href: "/docs/settings" },
      { label: "Log & Manage Entries", href: "/docs/entries" },
      { label: "View Analytics", href: "/docs/analytics" },
      { label: "Use Search", href: "/docs/search" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "API Library", href: "/docs/api" },
    ],
  },
  {
    title: "Internal",
    collapsible: true,
    items: [
      { label: "Application Build", href: "/docs/app-build" },
      { label: "ChiveBot Build", href: "/docs/chivebot-build" },
      { label: "Documentation Build", href: "/docs/docs-build" },
      { label: "Docs Chat Build", href: "/docs/chat-build" },
      { label: "Docs Reference", href: "/docs/reference" },
    ],
  },
];
