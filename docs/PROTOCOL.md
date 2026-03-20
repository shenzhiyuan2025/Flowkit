# FlowKit Protocol Specification v0.1

> **Status**: Draft  
> **Created**: March 2026  
> **License**: Apache 2.0

---

## 1. Design Principles

FlowKit Protocol is guided by five principles:

1. **Non-invasive**: Never replace existing message formats. Only add an optional `widgets` field.
2. **Dead simple**: A widget call requires only `type` + `data`. Nothing else is mandatory.
3. **LLM-friendly**: JSON structures optimized for LLM generation reliability.
4. **Fail gracefully**: Invalid widget JSON never crashes the UI — auto-fallback to text.
5. **Ecosystem-first**: All widgets (built-in and third-party) use identical APIs. No special privileges.

---

## 2. Message Format

### 2.1 Widget Embedding

A FlowKit-enhanced message is any standard chat message with an optional `widgets` array:

```json
{
  "role": "assistant",
  "content": "Here are the restaurants I found:",
  "widgets": [
    {
      "type": "flowkit/map-list",
      "data": {
        "locations": [
          {"name": "Sushi Zen", "lat": 31.23, "lng": 121.47, "rating": 4.8}
        ]
      },
      "options": {
        "style": "compact",
        "maxHeight": 300
      },
      "actions": {
        "onSelect": {"event": "location_selected", "params": ["id"]}
      },
      "fallback": "Sushi Zen (4.8★) - 200m away"
    }
  ]
}
```

### 2.2 Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `string` | ✅ | Widget identifier: `namespace/widget-name` |
| `data` | `object` | ✅ | Widget-specific payload. Validated against JSON Schema. |
| `options` | `object` | ❌ | Display preferences: `style`, `theme`, `size`, `locale`, `maxHeight`, etc. |
| `actions` | `object` | ❌ | Named callbacks for user interactions. Keys are event names, values define what data to send back. |
| `fallback` | `string` | ❌ | Plain text fallback when widget can't be rendered. Auto-generated if omitted. |
| `id` | `string` | ❌ | Unique ID for this widget instance. Auto-generated if omitted. Used for updates. |
| `trust` | `"L1" \| "L2"` | ❌ | Trust level override. Defaults to the widget's registered level. |

### 2.3 Namespace Convention

```
flowkit/chart          # Official built-in widget
acme/stock-ticker      # Third-party widget by "acme"
@user/custom-widget    # User-published widget
```

- `flowkit/*` — Reserved for official widgets
- `vendor/*` — Third-party publishers (must register namespace)
- `@user/*` — Individual developer widgets

---

## 3. Widget Schema

Every widget in the Registry must provide a JSON Schema that describes its `data` field. This enables:

1. **LLM prompt generation** — schema is converted to natural-language widget descriptions
2. **Validation** — Renderer validates incoming data before rendering
3. **Auto-fallback generation** — schema metadata enables text conversion

### 3.1 Schema Example

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "title": "flowkit/gauge",
  "description": "A semicircular gauge showing a percentage value with label. Use for win rates, completion percentages, scores.",
  "required": ["value"],
  "properties": {
    "value": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "The percentage value to display (0-100)"
    },
    "label": {
      "type": "string",
      "description": "Text label below the gauge"
    },
    "color": {
      "type": "string",
      "description": "Override color. Defaults to theme accent."
    },
    "size": {
      "type": "string",
      "enum": ["sm", "md", "lg"],
      "default": "md"
    }
  }
}
```

### 3.2 Prompt Hint

Each widget also provides a `promptHint` — a one-line description for LLM system prompts:

```
flowkit/gauge: Display a semicircular gauge (0-100%). Use for scores, win rates, completion. Required: value(number). Optional: label(string), size(sm|md|lg).
```

---

## 4. Widget Lifecycle

### 4.1 Render Flow

```
Agent sends message with widgets[]
        ↓
FlowKit Core parses widgets[]
        ↓
For each widget:
  1. Resolve type → find in local cache or fetch from Registry
  2. Validate data against JSON Schema
  3. If valid → render widget component
  4. If invalid → render fallback text (or generate from data)
        ↓
Rendered widgets are embedded in chat message bubble
```

### 4.2 Widget Update

An agent can update a previously rendered widget by referencing its `id`:

```json
{
  "content": "Updated route with less traffic:",
  "widgets": [
    {
      "id": "route-widget-1",
      "type": "flowkit/map-route",
      "data": { "...updated data..." }
    }
  ]
}
```

The Renderer performs a diff-update on the existing widget instance — no full re-render.

### 4.3 Widget Removal

To remove a widget from the chat:

```json
{
  "widgets": [
    { "id": "route-widget-1", "remove": true }
  ]
}
```

---

## 5. Action Model

### 5.1 User → Agent Actions

When a user interacts with a widget (click, select, submit), the Renderer fires an action event:

```json
{
  "event": "widget_action",
  "widgetId": "route-widget-1",
  "widgetType": "flowkit/map-route",
  "action": "call_ride",
  "data": {
    "origin": {"lat": 31.23, "lng": 121.47},
    "destination": {"lat": 31.19, "lng": 121.33}
  },
  "timestamp": "2026-03-19T10:30:00Z"
}
```

### 5.2 Action Definitions

Widgets declare supported actions in their schema:

```json
{
  "actions": {
    "call_ride": {
      "label": "Call a ride",
      "params": ["origin", "destination"],
      "description": "User wants to book a ride for this route"
    },
    "change_route": {
      "label": "Change route",
      "params": [],
      "description": "User wants an alternative route"
    }
  }
}
```

---

## 6. Trust Model

### 6.1 L1 — Declarative Widgets

- **Mechanism**: Pure JSON data binding. No executable code.
- **Security**: Highest. Widget is a pure function of data → visual output.
- **Capabilities**: Static display, simple interactions (click, select, input).
- **Examples**: Metric cards, charts, evidence lists, timelines.

### 6.2 L2 — Interactive Widgets

- **Mechanism**: Sandboxed JavaScript execution with restricted APIs.
- **Security**: High. Code runs in iframe sandbox with no DOM access to host.
- **Capabilities**: Drag & drop, complex animations, canvas rendering, state machines.
- **Examples**: Kanban boards, drawing tools, interactive maps with gestures.
- **Requirement**: Must pass Registry review before publishing.

### 6.3 Agent-Side Trust Configuration

```python
from flowkit import FlowKitConfig

config = FlowKitConfig(
    trust_level="L1",           # Only accept L1 widgets (most secure)
    # trust_level="L1+L2",     # Accept both levels
    allowed_namespaces=["flowkit/*", "verified/*"],  # Whitelist
    blocked_namespaces=["untrusted/*"],              # Blacklist
)
```

---

## 7. Registry Protocol

### 7.1 Widget Registration

```json
{
  "type": "mycompany/weather-card",
  "version": "1.0.0",
  "trust_level": "L1",
  "schema": { "...JSON Schema..." },
  "promptHint": "Show weather forecast for a city.",
  "renderer": {
    "react": "@mycompany/weather-card-react",
    "vue": "@mycompany/weather-card-vue"
  },
  "examples": [
    {
      "description": "Tokyo 7-day forecast",
      "data": { "city": "Tokyo", "days": 7 }
    }
  ],
  "tags": ["weather", "forecast", "outdoor"],
  "author": "mycompany",
  "license": "MIT"
}
```

### 7.2 Registry API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/widgets` | GET | List/search widgets |
| `/widgets/:type` | GET | Get widget details + schema |
| `/widgets` | POST | Publish a new widget |
| `/widgets/:type/versions` | GET | List versions |
| `/recommend` | POST | Get context-aware widget suggestions |

---

## 8. Compatibility Layer

### 8.1 A2UI Bridge

FlowKit can consume A2UI `updateComponents` messages and render them as L1 widgets:

```python
from flowkit.bridges import a2ui_to_flowkit

# Convert A2UI JSON to FlowKit widget format
flowkit_widgets = a2ui_to_flowkit(a2ui_message)
```

### 8.2 AG-UI Transport

FlowKit messages can be embedded in AG-UI event streams as `CUSTOM_EVENT` payloads:

```json
{
  "type": "CUSTOM_EVENT",
  "name": "flowkit_widgets",
  "value": {
    "widgets": [...]
  }
}
```

---

## 9. Versioning

- Protocol version: `0.1` (this document)
- Breaking changes increment major version
- Widget schemas are independently versioned via Registry
- Renderers must support at least the latest 2 protocol versions
