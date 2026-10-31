import { createHash } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/service";

const BURST_POINTS = 5;
const BURST_MS = 60 * 60 * 1000;
const DAILY_POINTS = 10;
const DAILY_MS = 86_400 * 1000;
const BURST_PREFIX = "docs_chat_burst_5_60m";
const DAILY_PREFIX = "docs_chat_daily_10";

function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export function chatQuotaReachedError(retryAt: Date) {
  return `Chat quota reached — try again after ${retryAt.toISOString()}.`;
}

function errorText(err: unknown) {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return String(err);
}

function isMissingQuotaStore(err: unknown) {
  return /PGRST202|PGRST205|Could not find the (table|function).*docs_chat_(limits|quota)/i.test(
    errorText(err),
  );
}

type QuotaResult = {
  ok?: unknown;
  retry_at?: unknown;
};

function parseQuota(data: unknown): QuotaResult {
  if (data && typeof data === "object") return data as QuotaResult;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as unknown;
      if (parsed && typeof parsed === "object") return parsed as QuotaResult;
    } catch {
      return {};
    }
  }
  return {};
}

export async function consumeDocsChatRateLimit(
  ip: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const hash = hashIp(ip || "unknown");
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("consume_docs_chat_quota", {
    p_burst_key: `${BURST_PREFIX}:${hash}`,
    p_daily_key: `${DAILY_PREFIX}:${hash}`,
    p_burst_max: BURST_POINTS,
    p_burst_ms: BURST_MS,
    p_daily_max: DAILY_POINTS,
    p_daily_ms: DAILY_MS,
  });
  if (error) {
    if (isMissingQuotaStore(error)) {
      console.error(
        "docs_chat_limits / consume_docs_chat_quota is missing. Paste the docs_chat_limits section of scripts/docs-chat.sql into the docs Supabase SQL editor.",
      );
      return { ok: true };
    }
    throw new Error(error.message);
  }

  const quota = parseQuota(data);
  if (quota.ok === false) {
    const retryAt = Number(quota.retry_at);
    return {
      ok: false,
      error: chatQuotaReachedError(
        Number.isFinite(retryAt) ? new Date(retryAt) : new Date(),
      ),
    };
  }
  return { ok: true };
}
