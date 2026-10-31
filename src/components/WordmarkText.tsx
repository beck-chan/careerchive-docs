export function WordmarkText({ className }: { className?: string } = {}) {
  return (
    <span className={["inline-wordmark", className].filter(Boolean).join(" ")}>
      <span className="app-wordmark-career">Career</span>
      <span className="app-wordmark-chive">Chive</span>
    </span>
  );
}
