"use client";

import { useEffect, useRef, useState } from "react";

export function DocsTaskToggle({
  defaultChecked = false,
}: {
  defaultChecked?: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    buttonRef.current
      ?.closest("li")
      ?.classList.toggle("is-checked", checked);
  }, [checked]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="docs-task-toggle"
      role="checkbox"
      aria-checked={checked}
      aria-label={checked ? "Mark as not done" : "Mark as done"}
      onClick={() => setChecked((value) => !value)}
    />
  );
}
