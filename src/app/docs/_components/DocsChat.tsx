"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";
import { DocsChatPending } from "./DocsChatPending";

const MOBILE_QUERY = "(max-width: 900px)";

type PanelProps = {
  onMaximizedChange?: (maximized: boolean) => void;
  modal?: boolean;
  onDismiss?: () => void;
};

type DocsChatContextValue = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const DocsChatContext = createContext<DocsChatContextValue>({
  open: false,
  openChat: () => {},
  closeChat: () => {},
  toggleChat: () => {},
});

function subscribeMobile(onChange: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function mobileNow() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function useDocsChat() {
  return useContext(DocsChatContext);
}

export function DocsChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);
  const toggleChat = useCallback(() => setOpen((value) => !value), []);

  return (
    <DocsChatContext.Provider value={{ open, openChat, closeChat, toggleChat }}>
      {children}
    </DocsChatContext.Provider>
  );
}

function ChatGlyph() {
  return (
    <svg
      className="docs-chat-icon-glyph"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 6.75h14A1.25 1.25 0 0 1 20.25 8v8A1.25 1.25 0 0 1 19 17.25h-6.15L8 20.4v-3.15H5A1.25 1.25 0 0 1 3.75 16V8A1.25 1.25 0 0 1 5 6.75Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DocsChatIcon({ className }: { className?: string }) {
  const { open, toggleChat } = useDocsChat();
  return (
    <button
      type="button"
      className={className ?? "docs-chat-icon"}
      aria-label={open ? "Hide chat" : "Ask the documentation"}
      aria-expanded={open}
      aria-haspopup="dialog"
      onClick={toggleChat}
    >
      <ChatGlyph />
    </button>
  );
}

export function DocsChat() {
  const { open, closeChat, toggleChat } = useDocsChat();
  const [maximized, setMaximized] = useState(false);
  const [Panel, setPanel] = useState<ComponentType<PanelProps> | null>(null);
  const mobile = useSyncExternalStore(subscribeMobile, mobileNow, () => false);

  useEffect(() => {
    if (!open || Panel) return;
    let cancelled = false;
    import("./DocsChatPanel").then((mod) => {
      if (!cancelled) {
        setPanel(() => mod.DocsChatPanel);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, Panel]);

  const modal = open && mobile;

  return (
    <div
      className={
        maximized || modal ? "docs-chat docs-chat-is-max" : "docs-chat"
      }
    >
      {open ? (
        Panel ? (
          <Panel
            modal={modal}
            onDismiss={closeChat}
            onMaximizedChange={setMaximized}
          />
        ) : (
          <DocsChatPending maximized={modal} onDismiss={modal ? closeChat : undefined} />
        )
      ) : null}
      <button
        type="button"
        className="docs-chat-toggle"
        aria-expanded={open}
        onClick={toggleChat}
      >
        {open ? "hide chat" : "ask the documentation"}
      </button>
    </div>
  );
}
