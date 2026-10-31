::: {.callout}
# My custom install combines an interactive poetry volume with the guestbook commenting functionality:

- [`src/app/page.tsx`](https://github.com/beck-chan/guestbook/blob/main/src/app/page.tsx){.blank} loads poems, the hit counter, and the first comments page, then renders [`PoetryDesk`](https://github.com/beck-chan/guestbook/blob/main/src/components/_desk/PoetryDesk.tsx){.blank}.
- [`src/app/admin/page.tsx`](https://github.com/beck-chan/guestbook/blob/main/src/app/admin/page.tsx){.blank} is the gated admin dashboard for moderation and settings.
- Compile-time switches live in [`src/lib/flags.ts`](https://github.com/beck-chan/guestbook/blob/main/src/lib/flags.ts){.blank}. 
:::

## Supabase Backend

::: {.tabset}

# Row-Level Security

The schema applied by running [`scripts/schema.sql`](https://github.com/beck-chan/guestbook/blob/main/scripts/schema.sql){.blank} enables row-level security on every public table ΓÇö `is_admin()` is true only when the JWT has `app_metadata.role = 'admin'` (stamped from the allow-list at signup, not from editable `user_metadata`).

| Table | `anon` | Admin (`authenticated` + `is_admin()`) |
| --- | --- | --- |
| `comments` | {.insert} | {.select}, {.insert}, {.update}, {.delete} |
| `guestbook_settings` | {.select} | {.select}, {.update} |
| `admin_allowlist` | none | none |
| `poem_hearts` | none | none |

- `comments` has no public {.select}, so emails stay on the private table. Visitors read the `comments_public` view instead (`id`, `display_name`, `body`, timestamps).
- `guestbook_settings` is a singleton (`id = 1`) ΓÇö no {.insert} or {.delete} policies. {.select} is granted to `anon` and `authenticated`.
- `admin_allowlist` has RLS on with no policies, so `anon` / `authenticated` cannot read or write. `service_role` bypasses RLS (and still needs table grants). Auth's `before-user-created hook` reads it as `supabase_auth_admin`.
- `poem_hearts` has no table policies. Likes go through the security-definer RPCs `toggle_poem_heart` and `poem_heart_state`. Public counts come from `poem_heart_counts` and `poem_heart_total`.

# Entity Relationship Diagram

<DocsErdGrid>

<DocsMermaid chart={`erDiagram
    direction TB
    admin_allowlist {
        text email PK
        timestamptz created_at
    }
    auth_users {
        uuid id PK
        text email
        jsonb app_metadata
    }
    admin_allowlist |o..o| auth_users : "email match"
`} />

<DocsMermaid chart={`erDiagram
    direction TB
    comments {
        uuid id PK
        text display_name
        text email
        text body
        boolean is_read
        timestamptz created_at
        timestamptz updated_at
    }
    comments_public {
        uuid id PK
        text display_name
        text body
        timestamptz created_at
        timestamptz updated_at
    }
    comments ||--|| comments_public : "public view"
`} />

<DocsMermaid chart={`erDiagram
    direction TB
    guestbook_settings {
        int id PK
        text title
        boolean marquee
        boolean capture_email
        int comment_length
    }
`} />

<DocsMermaid chart={`erDiagram
    direction TB
    poem_hearts {
        uuid id PK
        text poem_id
        text visitor_key
        timestamptz created_at
    }
    poem_heart_counts {
        text poem_id
        bigint heart_count
    }
    poem_hearts }o--o| poem_heart_counts : aggregates
`} />

</DocsErdGrid>

:::

## Next.js Frontend

## User Login

## Feature Flags

Flags are built on compile:

- [`src/lib/flags.ts`](https://github.com/beck-chan/guestbook/blob/main/src/lib/flags.ts){.blank} reads `process.env.FLAG_*` with `envFlag` (`true` / `1` vs `false` / `0` ΓÇö unset uses the default). `FLAG_COUNTER_URL` and `FLAG_COUNTER_DATE` are not in this file ΓÇö [`getUniqueVisitors()`](https://github.com/beck-chan/guestbook/blob/main/src/lib/uniqueVisitors.ts){.blank} reads them at request time so Next does not bake them into the client bundle.
- [`next.config.ts`](https://github.com/beck-chan/guestbook/blob/main/next.config.ts){.blank} lists the boolean flag names under `env` so Next can inline them into client components. 

### `FLAG_DOCS`

When set to `false`, hides the **View Docs** link from view, and swaps in the **Admin Login** link instead. Only used for v1 of the public deployment when I was still completing the documentation so nobody stumbled upon the incomplete guides.

### `FLAG_DOCSONLY`

Serves only the documentation instead of the full guestbook application for a lighter weight preview when authoring docs. Can be called with `npm run docs` which sets `FLAG_DOCSONLY=true` on that process via [`scripts/docs-dev.mjs`](https://github.com/beck-chan/guestbook/blob/main/scripts/docs-dev.mjs){.blank} (overrides `.env.local`). 


## Accessibility

Along with checking pages with [Chrome's Lighthouse accessibility audit](https://developer.chrome.com/docs/accessibility), as part of pull request checks, [a11y lint](https://github.com/beck-chan/guestbook/blob/main/.github/workflows/lint-a11y-check.yaml){.blank} runs a spot check on all guestbook application pages to ensure they are somewhat accessible and any errors discovered are patched before deployment.

