import { DocsTaskToggle } from "./DocsTaskToggle";

export function DocsTaskItem({
  defaultChecked = false,
  className,
  children,
  ...props
}: {
  defaultChecked?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<"li">) {
  return (
    <li
      className={[className, defaultChecked ? "is-checked" : undefined]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <DocsTaskToggle defaultChecked={defaultChecked} />
      {children}
    </li>
  );
}
