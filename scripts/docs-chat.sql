-- Docs chatbot index and history (paste once into the docs site's
-- Supabase SQL Editor). CareerChive docs only. Do not merge into an app
-- schema.sql. Do not copy into your-careerchive.
--
-- The browser never talks to these tables. Row-level security is on with
-- no anon / authenticated policies. scripts/sync-docs.ts (and later
-- /docs/chat) use the service_role client + SUPABASE_SECRET_KEY.
--
-- How to run:
--   1. Paste this file into the docs Supabase SQL editor and run it.
--      If you already ran an earlier copy, paste only the docs_chat_limits
--      section at the bottom (table if missing, plus consume_docs_chat_quota).
--      The table columns do not need ALTER if they are already
--      key / points / expire.
--   2. Put DOCS_GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, and
--      SUPABASE_SECRET_KEY in careerchive-docs/.env.local
--      (see .env.example).
--   3. From the repo root: npm run sync-docs
--      (optional BRANCH=main; default is main).
--   4. Merged MDX on main can run .github/workflows/sync-docs.yml once
--      those three names exist as GitHub repository secrets.

-- ---------------------------------------------------------------------------
-- vector (pgvector)
-- ---------------------------------------------------------------------------
-- Hosted Supabase can enable this. Local Postgres without pgvector still
-- accepts the CREATE EXTENSION line; tables below need the type. If it
-- did not apply, enable vector in the Dashboard (Database → Extensions)
-- and re-run this file.

do $vector$
begin
  create extension if not exists vector;
exception
  when others then
    raise notice
      'vector not available; skipped create extension (%). Enable vector in Database → Extensions and re-run scripts/docs-chat.sql.',
      sqlerrm;
end;
$vector$;

do $need_vector$
begin
  if to_regtype('vector') is null then
    raise exception
      'vector type is not available. Enable the vector extension in Database → Extensions, then re-run scripts/docs-chat.sql.';
  end if;
end;
$need_vector$;

-- ---------------------------------------------------------------------------
-- docs_section
-- ---------------------------------------------------------------------------
-- One row per indexed docs chunk (page overview or heading).
-- id is the existing chunk id, for example quickstart#install.
-- embedding is 768 dimensions to match Gemini gemini-embedding-001
-- (outputDimensionality 768) in sync-docs.ts.
-- No public column: CareerChive docs has no public/private gating.
-- A second paste fails if this table already exists.

create table public.docs_section (
  id text primary key,
  href text not null,
  title text not null,
  heading text not null,
  section text not null default '',
  body text not null,
  content_hash text not null,
  embedding vector(768) not null,
  -- A = title, B = heading, C = body, so a title match outranks a heading,
  -- and a heading outranks the body. Generated; sync does not write this column.
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', heading), 'B') ||
    setweight(to_tsvector('english', body), 'C')
  ) stored
);

alter table public.docs_section enable row level security;
-- No anon/authenticated policies. Browser never talks to this table.
revoke all on table public.docs_section from anon, authenticated, public;
grant select, insert, update, delete on table public.docs_section to service_role;

-- ---------------------------------------------------------------------------
-- match_docs_sections
-- ---------------------------------------------------------------------------
-- Meaning search. <=> is cosine distance. No only_public filter.
-- New functions are executable by public unless revoked.

create or replace function public.match_docs_sections(
  query_embedding vector(768),
  match_count int
)
returns setof public.docs_section
language sql
stable
as $$
  select *
  from public.docs_section
  order by embedding <=> query_embedding
  limit least(match_count, 50);
$$;

revoke all on function public.match_docs_sections(vector, int)
  from public, anon, authenticated;
grant execute on function public.match_docs_sections(vector, int)
  to service_role;

-- ---------------------------------------------------------------------------
-- search_docs_sections
-- ---------------------------------------------------------------------------
-- Wording search. query is a to_tsquery('english') expression built by
-- the chat route (inflected terms joined with |). Rank uses the
-- title/heading/body weights on search_vector. No only_public filter.
-- execute is service_role only.

create or replace function public.search_docs_sections(
  query text,
  match_count int
)
returns setof public.docs_section
language plpgsql
stable
as $$
begin
  if query is null or btrim(query) = '' then
    return;
  end if;

  return query
    select *
    from public.docs_section
    where search_vector @@ to_tsquery('english', query)
    order by ts_rank_cd(search_vector, to_tsquery('english', query)) desc
    limit least(match_count, 50);
end;
$$;

revoke all on function public.search_docs_sections(text, int)
  from public, anon, authenticated;
grant execute on function public.search_docs_sections(text, int)
  to service_role;

-- ---------------------------------------------------------------------------
-- docs_query_embedding
-- ---------------------------------------------------------------------------
-- Shared cache of question embeddings for /docs/chat. The key is a hash of
-- the question, so the question text is not stored. Safe to run again.
-- A statement trigger keeps the newest 200 rows.

create table if not exists public.docs_query_embedding (
  id text primary key,
  model text not null,
  dims int not null,
  task_type text not null,
  embedding vector(768) not null,
  created_at timestamptz not null default now()
);

alter table public.docs_query_embedding enable row level security;
revoke all on table public.docs_query_embedding from anon, authenticated, public;
grant select, insert, update, delete on table public.docs_query_embedding to service_role;

create or replace function public.trim_docs_query_embedding()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  delete from public.docs_query_embedding
  where id in (
    select id
    from public.docs_query_embedding
    order by created_at desc
    offset 200
  );
  return null;
end;
$$;

revoke all on function public.trim_docs_query_embedding()
  from public, anon, authenticated;
grant execute on function public.trim_docs_query_embedding() to service_role;

drop trigger if exists docs_query_embedding_trim on public.docs_query_embedding;
create trigger docs_query_embedding_trim
  after insert or update on public.docs_query_embedding
  for each statement
  execute function public.trim_docs_query_embedding();

-- ---------------------------------------------------------------------------
-- docs_chat_session
-- ---------------------------------------------------------------------------
-- One conversation. Cookie docs_chat_id (httpOnly, path /) stores this
-- row's ID so the same browser session can restore the thread.
-- Clear Chat deletes this row; messages cascade.

create table public.docs_chat_session (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_docs_chat_session_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

create trigger docs_chat_session_set_updated_at
  before update on public.docs_chat_session
  for each row
  execute function public.set_docs_chat_session_updated_at();

alter table public.docs_chat_session enable row level security;
-- No anon/authenticated policies. Browser never talks to these tables.
revoke all on table public.docs_chat_session from anon, authenticated, public;
grant select, insert, update, delete on table public.docs_chat_session to service_role;

-- ---------------------------------------------------------------------------
-- docs_chat_message
-- ---------------------------------------------------------------------------
-- Each turn in that conversation: the user's question or the assistant's
-- reply (role), the wording (content), and for replies the retrieved page
-- links (sources). Deleting a session deletes associated messages.

create table public.docs_chat_message (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.docs_chat_session (id) on delete cascade,
  role text not null,
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now(),
  constraint docs_chat_message_role_check check (role in ('user', 'assistant'))
);

create index docs_chat_message_session_id_created_at_idx
  on public.docs_chat_message (session_id, created_at);

alter table public.docs_chat_message enable row level security;
revoke all on table public.docs_chat_message from anon, authenticated, public;
grant select, insert, update, delete on table public.docs_chat_message to service_role;

-- Optional retention (no cron in v1). Run by hand if the table grows:
-- delete from public.docs_chat_message where created_at < now() - interval '90 days';
-- delete from public.docs_chat_session s
--   where not exists (
--     select 1 from public.docs_chat_message m where m.session_id = s.id
--   );

-- ---------------------------------------------------------------------------
-- docs_chat_limits
-- ---------------------------------------------------------------------------
-- Chat IP quotas (5 questions per hour, 10 per day)
-- Hashed IP buckets. consume_docs_chat_quota locks both
-- windows in one round-trip. /docs/chat calls it with the service_role
-- client (no DATABASE_URL).
--
-- Safe to paste this whole section alone if you already ran the rest of
-- this file. create table if not exists + create or replace function.
-- If docs_chat_limits already exists with key / points / expire, skip
-- the CREATE TABLE and paste from consume_docs_chat_quota through GRANT
-- EXECUTE. Do not ALTER the table.

create table if not exists public.docs_chat_limits (
  key varchar(255) primary key,
  points integer not null default 0,
  expire bigint
);

alter table public.docs_chat_limits enable row level security;
revoke all on table public.docs_chat_limits from anon, authenticated, public;
grant select, insert, update, delete on table public.docs_chat_limits to service_role;

create or replace function public.consume_docs_chat_quota(
  p_burst_key text,
  p_daily_key text,
  p_burst_max int default 5,
  p_burst_ms bigint default 3600000,
  p_daily_max int default 10,
  p_daily_ms bigint default 86400000
)
returns jsonb
language plpgsql
set search_path = public
as $fn$
declare
  now_ms bigint := (extract(epoch from clock_timestamp()) * 1000)::bigint;
  burst_points int;
  burst_expire bigint;
  daily_points int;
  daily_expire bigint;
  retry_ms bigint := 0;
begin
  insert into public.docs_chat_limits (key, points, expire)
  values (p_burst_key, 0, now_ms + p_burst_ms)
  on conflict (key) do nothing;
  insert into public.docs_chat_limits (key, points, expire)
  values (p_daily_key, 0, now_ms + p_daily_ms)
  on conflict (key) do nothing;

  if p_burst_key < p_daily_key then
    select points, expire into burst_points, burst_expire
    from public.docs_chat_limits where key = p_burst_key for update;
    select points, expire into daily_points, daily_expire
    from public.docs_chat_limits where key = p_daily_key for update;
  else
    select points, expire into daily_points, daily_expire
    from public.docs_chat_limits where key = p_daily_key for update;
    select points, expire into burst_points, burst_expire
    from public.docs_chat_limits where key = p_burst_key for update;
  end if;

  if burst_expire is null or burst_expire < now_ms then
    burst_points := 0;
    burst_expire := now_ms + p_burst_ms;
  end if;
  if daily_expire is null or daily_expire < now_ms then
    daily_points := 0;
    daily_expire := now_ms + p_daily_ms;
  end if;

  if burst_points >= p_burst_max then
    retry_ms := burst_expire;
  end if;
  if daily_points >= p_daily_max and daily_expire > retry_ms then
    retry_ms := daily_expire;
  end if;
  if retry_ms > 0 then
    return jsonb_build_object('ok', false, 'retry_at', retry_ms);
  end if;

  update public.docs_chat_limits
  set points = burst_points + 1, expire = burst_expire
  where key = p_burst_key;
  update public.docs_chat_limits
  set points = daily_points + 1, expire = daily_expire
  where key = p_daily_key;

  return jsonb_build_object('ok', true);
end;
$fn$;

revoke all on function public.consume_docs_chat_quota(text, text, int, bigint, int, bigint)
  from public, anon, authenticated;
grant execute on function public.consume_docs_chat_quota(text, text, int, bigint, int, bigint)
  to service_role;
