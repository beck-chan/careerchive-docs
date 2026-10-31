import { ChatStatusText } from "./ChatStatusText";

export function DocsChatPending({
  maximized = false,
  onDismiss,
}: {
  maximized?: boolean;
  onDismiss?: () => void;
}) {
  return (
    <div
      className={
        maximized ? "docs-chat-panel docs-chat-panel-max" : "docs-chat-panel"
      }
      role="status"
      aria-live="polite"
      aria-label="Docs chat"
    >
      <div className="docs-chat-head">
        <p className="docs-chat-title">Ask the Documentation</p>
        {onDismiss ? (
          <button
            type="button"
            className="docs-chat-close"
            aria-label="Close chat"
            onClick={onDismiss}
          >
            <svg className="docs-chat-max-glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
      <div className="docs-chat-log">
        <div className="docs-chat-bubble docs-chat-bubble-assistant">
          <p className="docs-chat-retrieving" aria-label="Loading chat">
            <ChatStatusText text="Loading chat" />
          </p>
        </div>
      </div>
    </div>
  );
}
