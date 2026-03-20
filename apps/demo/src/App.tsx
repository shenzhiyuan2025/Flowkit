import { FlowKitChat } from "@flowkit/react";
import type { FlowKitMessage } from "@flowkit/protocol";
import { builtInWidgets } from "@flowkit/widgets";

const messages: FlowKitMessage[] = [
  {
    role: "assistant",
    content: "这里是附近餐厅推荐：",
    widgets: [
      {
        type: "flowkit/map-list",
        data: {
          locations: [
            { name: "Sushi Zen", lat: 31.23, lng: 121.47, rating: 4.8, distance: "200m" },
            { name: "Pasta House", lat: 31.22, lng: 121.48, rating: 4.6, distance: "450m" }
          ]
        }
      },
      {
        type: "flowkit/quick-actions",
        data: {
          items: [{ label: "预约晚餐" }, { label: "查看路线" }, { label: "只看高评分" }]
        }
      }
    ]
  },
  {
    role: "assistant",
    content: "这是你的关键指标：",
    widgets: [
      {
        type: "flowkit/metrics",
        data: {
          items: [
            { label: "Revenue", value: "¥3.28M", trend: 12.5 },
            { label: "Orders", value: "4,892", trend: 8.3 },
            { label: "Conv Rate", value: "3.8%", trend: 0.5 }
          ]
        }
      }
    ]
  }
];

export function App() {
  return (
    <>
      <h1>FlowKit Demo</h1>
      <FlowKitChat
        messages={messages}
        widgets={builtInWidgets}
        onAction={(action) => {
          console.log("FlowKit Action", action);
        }}
      />
    </>
  );
}
