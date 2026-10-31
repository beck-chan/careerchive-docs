import { DocsCodeCopy } from "./DocsCodeCopy";

export function DocsCodeBlock({
  children,
  className,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <div className="docs-code-block">
      <DocsCodeCopy />
      <pre
        {...props}
        className={["docs-code", className].filter(Boolean).join(" ")}
      >
        {children}
      </pre>
    </div>
  );
}
