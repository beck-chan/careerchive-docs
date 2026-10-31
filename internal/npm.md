## Build

```bash
npm run build
npm run start
```

## Linter

```bash
npm run lint
npm run lint:a11y
npm run lint:a11y-docs
```

## Versioning

```bash
npm version patch
npm version minor
npm version major
```

## User Login

```bash
npx career-chive login
```

## Sync Docs

[`scripts/sync-docs.ts`](/scripts/sync-docs.ts) uses the API key to index our MDX documentation for our chatbot to search:

```bash
npm run sync-docs
```

To index from a specific branch:

```bash
# Example branch `supabot`
BRANCH=supabot npm run sync-docs
```

- Unchanged chunks are skipped via `content_hash` on `docs_section`. Vectors already computed stay in `internal/docsbot/embed-cache.json` (gitignored).
- Unchanged chunks are not sent to Gemini again. The first run still embeds everything — later syncs only pay for edits.
