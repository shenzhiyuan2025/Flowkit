import { ActionBus, parseMessage, type WidgetActionEvent } from "@flowkit/core";
import type { FlowKitMessage } from "@flowkit/protocol";
import { useEffect, useMemo } from "react";
import { WidgetRegistryProvider, type WidgetMap } from "./WidgetRegistry";
import { WidgetSlot } from "./WidgetSlot";

export interface FlowKitChatProps {
  messages: FlowKitMessage[];
  widgets?: WidgetMap;
  onAction?: (action: WidgetActionEvent) => void;
}

export function FlowKitChat({ messages, widgets, onAction }: FlowKitChatProps) {
  const bus = useMemo(() => new ActionBus(), []);

  useEffect(() => {
    if (!onAction) {
      return;
    }
    return bus.onAction(onAction);
  }, [bus, onAction]);

  return (
    <WidgetRegistryProvider widgets={widgets}>
      <div className="flowkit-chat">
        {messages.map((message, i) => {
          const parsed = parseMessage(message);
          return (
            <div key={`flowkit-message-${i}`} className="flowkit-message">
              <div className="flowkit-text">{parsed.text}</div>
              {parsed.widgets.map((item) => (
                <WidgetSlot
                  key={item.widget.id}
                  item={item}
                  onAction={(event, data) => {
                    if (item.widget.id) {
                      bus.dispatch({
                        event,
                        widgetId: item.widget.id,
                        widgetType: item.widget.type,
                        data
                      });
                    }
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </WidgetRegistryProvider>
  );
}
