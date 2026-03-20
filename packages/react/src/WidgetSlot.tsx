import type { ParsedWidget } from "@flowkit/core";
import { useWidgetRegistry } from "./WidgetRegistry";

export function WidgetSlot({
  item,
  onAction
}: {
  item: ParsedWidget;
  onAction?: (event: string, data?: Record<string, unknown>) => void;
}) {
  const registry = useWidgetRegistry();
  const ResolvedWidget = registry[item.widget.type];

  if (!item.valid || !ResolvedWidget) {
    return (
      <div className="flowkit-fallback">
        {item.fallbackText ?? item.widget.fallback ?? `组件 ${item.widget.type} 暂不可用`}
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (onAction) {
          onAction("widget_clicked", {
            widgetId: item.widget.id,
            widgetType: item.widget.type
          });
        }
      }}
    >
      <ResolvedWidget data={item.widget.data} />
    </div>
  );
}
