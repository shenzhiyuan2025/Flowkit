import { validateWidget, type FlowKitMessage, type FlowKitWidget } from "@flowkit/protocol";
import { generateFallbackText } from "./fallback";

export interface ParsedWidget {
  widget: FlowKitWidget;
  valid: boolean;
  fallbackText?: string;
  errors?: string[];
}

export interface ParsedMessage {
  text: string;
  widgets: ParsedWidget[];
  hasWidgets: boolean;
}

function withWidgetId(widget: FlowKitWidget, idx: number): FlowKitWidget {
  if (widget.id) {
    return widget;
  }
  return { ...widget, id: `${widget.type}-${idx}` };
}

export function parseMessage(message: FlowKitMessage): ParsedMessage {
  const widgets = (message.widgets ?? []).map((input, idx) => {
    const checked = validateWidget(input);
    if (!checked.valid || !checked.value) {
      return {
        widget: withWidgetId(
          {
            type: input.type || "flowkit/unknown",
            data: input.data || {},
            fallback: input.fallback
          } as FlowKitWidget,
          idx
        ),
        valid: false,
        fallbackText: generateFallbackText(input),
        errors: checked.errors
      } satisfies ParsedWidget;
    }
    return {
      widget: withWidgetId(checked.value, idx),
      valid: true
    } satisfies ParsedWidget;
  });

  return {
    text: message.content,
    widgets,
    hasWidgets: widgets.length > 0
  };
}
