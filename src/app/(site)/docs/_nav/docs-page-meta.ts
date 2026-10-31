import {
  frontmatter as analyticsFm,
  title as analyticsTitle,
} from "../(article)/analytics/content.mdx";
import { frontmatter as apiFm, title as apiTitle } from "../(article)/api/content.mdx";
import {
  frontmatter as appBuildFm,
  title as appBuildTitle,
} from "../(article)/app-build/content.mdx";
import {
  frontmatter as chatBuildFm,
  title as chatBuildTitle,
} from "../(article)/chat-build/content.mdx";
import {
  frontmatter as chatbotFm,
  title as chatbotTitle,
} from "../(article)/chatbot/content.mdx";
import {
  frontmatter as chivebotBuildFm,
  title as chivebotBuildTitle,
} from "../(article)/chivebot-build/content.mdx";
import {
  frontmatter as docsBuildFm,
  title as docsBuildTitle,
} from "../(article)/docs-build/content.mdx";
import {
  frontmatter as entriesFm,
  title as entriesTitle,
} from "../(article)/entries/content.mdx";
import {
  frontmatter as installFm,
  title as installTitle,
} from "../(article)/install/content.mdx";
import {
  frontmatter as prerequisitesFm,
  title as prerequisitesTitle,
} from "../(article)/prerequisites/content.mdx";
import {
  frontmatter as quickstartFm,
  title as quickstartTitle,
} from "../(article)/quickstart/content.mdx";
import {
  frontmatter as referenceFm,
  title as referenceTitle,
} from "../(article)/reference/content.mdx";
import {
  frontmatter as searchFm,
  title as searchTitle,
} from "../(article)/search/content.mdx";
import {
  frontmatter as settingsFm,
  title as settingsTitle,
} from "../(article)/settings/content.mdx";

export type DocsPageMeta = {
  title: string;
  subtitle?: string;
};

function page(title: string, frontmatter?: { subtitle?: string }): DocsPageMeta {
  const subtitle = frontmatter?.subtitle?.trim();
  return subtitle ? { title, subtitle } : { title };
}

export const DOCS_PAGE_META: Record<string, DocsPageMeta> = {
  "/docs/prerequisites": page(prerequisitesTitle, prerequisitesFm),
  "/docs/quickstart": page(quickstartTitle, quickstartFm),
  "/docs/install": page(installTitle, installFm),
  "/docs/chatbot": page(chatbotTitle, chatbotFm),
  "/docs/settings": page(settingsTitle, settingsFm),
  "/docs/entries": page(entriesTitle, entriesFm),
  "/docs/analytics": page(analyticsTitle, analyticsFm),
  "/docs/search": page(searchTitle, searchFm),
  "/docs/api": page(apiTitle, apiFm),
  "/docs/app-build": page(appBuildTitle, appBuildFm),
  "/docs/chivebot-build": page(chivebotBuildTitle, chivebotBuildFm),
  "/docs/docs-build": page(docsBuildTitle, docsBuildFm),
  "/docs/chat-build": page(chatBuildTitle, chatBuildFm),
  "/docs/reference": page(referenceTitle, referenceFm),
};
