export interface WidgetActionEvent {
  event: string;
  widgetId: string;
  widgetType: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

type Listener = (action: WidgetActionEvent) => void;

export class ActionBus {
  private listeners = new Set<Listener>();

  onAction(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispatch(action: Omit<WidgetActionEvent, "timestamp"> & { timestamp?: string }): void {
    const event: WidgetActionEvent = {
      ...action,
      timestamp: action.timestamp ?? new Date().toISOString()
    };
    this.listeners.forEach((listener) => listener(event));
  }
}
