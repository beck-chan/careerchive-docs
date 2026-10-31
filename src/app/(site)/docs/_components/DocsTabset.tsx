import { Children, isValidElement, useId } from "react";
import { DocsTabsetChrome, type DocsTabMeta } from "./DocsTabsetChrome";

export type DocsTab = DocsTabMeta & {
  content: React.ReactNode;
};

export function DocsTab({
  children,
}: {
  label: string;
  icon?: DocsTab["icon"];
  iconPlace?: DocsTab["iconPlace"];
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

function tabsFromChildren(children: React.ReactNode): DocsTab[] {
  return Children.toArray(children).flatMap((child) => {
    if (
      !isValidElement<{
        label?: string;
        icon?: DocsTab["icon"];
        iconPlace?: DocsTab["iconPlace"];
        children?: React.ReactNode;
      }>(child)
    ) {
      return [];
    }
    if (typeof child.props.label !== "string") {
      return [];
    }
    return [
      {
        label: child.props.label,
        icon: child.props.icon,
        iconPlace: child.props.iconPlace,
        content: child.props.children,
      },
    ];
  });
}

export function DocsTabset({
  tabs,
  children,
}: {
  tabs?: DocsTab[];
  children?: React.ReactNode;
}) {
  const resolved = tabs ?? tabsFromChildren(children);
  const baseId = useId();

  return (
    <div className="docs-tabset">
      <DocsTabsetChrome
        baseId={baseId}
        tabs={resolved.map(({ label, icon, iconPlace }) => ({
          label,
          icon,
          iconPlace,
        }))}
      />
      {resolved.map((tab, index) => {
        const selected = index === 0;

        return (
          <div
            key={tab.label}
            role="tabpanel"
            id={`${baseId}-panel-${index}`}
            className={`docs-tabset-panel${selected ? " is-active" : ""}`}
            aria-labelledby={`${baseId}-tab-${index}`}
            hidden={!selected}
            data-docs-tab-panel={index}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
