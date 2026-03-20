import type { FlowKitWidget } from "@flowkit/protocol";

export function generateFallbackText(widget: Partial<FlowKitWidget>): string {
  if (widget.fallback) {
    return widget.fallback;
  }
  if (widget.type) {
    return `无法渲染组件 ${widget.type}，已回退为文本。`;
  }
  return "无法渲染组件，已回退为文本。";
}
