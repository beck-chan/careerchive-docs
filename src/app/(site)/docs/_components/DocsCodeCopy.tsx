"use client";

import { useEffect, useRef, useState } from "react";

export function DocsCodeCopy() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current != null) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  async function copy() {
    const text =
      buttonRef.current?.parentElement?.querySelector("pre")?.textContent ?? "";
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (resetTimer.current != null) {
        clearTimeout(resetTimer.current);
      }
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`docs-code-copy${copied ? " is-copied" : ""}`}
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy"}
    />
  );
}
