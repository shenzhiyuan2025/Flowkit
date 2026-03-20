import type { WidgetMap } from "@flowkit/react";

function MetricsWidget({ data }: { data: Record<string, unknown> }) {
  const items = (data.items as Array<{ label: string; value: string; trend?: number }>) ?? [];
  return (
    <div className="flowkit-card">
      <strong>KPI</strong>
      <div>
        {items.map((item) => (
          <div key={item.label}>
            {item.label}: {item.value}
            {typeof item.trend === "number" ? ` (${item.trend > 0 ? "+" : ""}${item.trend}%)` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionsWidget({ data }: { data: Record<string, unknown> }) {
  const items = (data.items as Array<{ label: string }>) ?? [];
  return (
    <div className="flowkit-card">
      <div>快捷操作</div>
      <div>
        {items.map((item) => (
          <button key={item.label} type="button">
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MapListWidget({ data }: { data: Record<string, unknown> }) {
  const locations = (data.locations as Array<{ name: string; rating?: number; distance?: string }>) ?? [];
  return (
    <div className="flowkit-card">
      <strong>附近地点</strong>
      <ul>
        {locations.map((loc) => (
          <li key={loc.name}>
            {loc.name} {typeof loc.rating === "number" ? `⭐${loc.rating}` : ""} {loc.distance ?? ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const builtInWidgets: WidgetMap = {
  "flowkit/metrics": MetricsWidget,
  "flowkit/quick-actions": QuickActionsWidget,
  "flowkit/map-list": MapListWidget
};
