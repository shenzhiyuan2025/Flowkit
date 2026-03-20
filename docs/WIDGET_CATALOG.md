# FlowKit Widget Catalog v0.1

> Complete reference for all built-in widgets. Each widget includes type ID, data schema, prompt hint, and usage examples.

---

## Overview

FlowKit v0.1 ships with **30 built-in widgets** across 6 categories. All built-in widgets:

- Use the same API as third-party widgets (no special privileges)
- Are tree-shakeable (only used widgets are bundled)
- Include JSON Schema, LLM prompt hints, and example data
- Support light/dark themes and responsive sizing

---

## 📊 Data Display (6 widgets)

### `flowkit/metrics`

KPI metric cards with trend indicators. Supports 1-6 items in a responsive grid.

```json
{
  "type": "flowkit/metrics",
  "data": {
    "items": [
      {"label": "Revenue", "value": "¥3.28M", "trend": 12.5, "icon": "💰"},
      {"label": "Orders", "value": "4,892", "trend": 8.3},
      {"label": "Avg Price", "value": "¥670", "trend": -2.1},
      {"label": "Conv Rate", "value": "3.8%", "trend": 0.5}
    ]
  }
}
```

**Prompt hint**: `Display KPI metric cards with values and trend arrows. Required: items[](label, value). Optional: trend(number, positive=up), icon(emoji).`

---

### `flowkit/chart`

Charts: line, bar, pie, area. Powered by lightweight charting engine.

```json
{
  "type": "flowkit/chart",
  "data": {
    "chartType": "bar",
    "title": "Monthly Sales",
    "series": [
      {"name": "2025", "values": [120, 150, 180, 200, 175, 220]},
      {"name": "2026", "values": [140, 165, 210, 240, 195, 260]}
    ],
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "forecast": {"startIndex": 5, "label": "Projected"}
  }
}
```

**Prompt hint**: `Display a chart. Required: chartType(line|bar|pie|area), series[](name, values[]). Optional: labels[], title, forecast.`

---

### `flowkit/data-table`

Sortable, filterable data table with pagination.

```json
{
  "type": "flowkit/data-table",
  "data": {
    "columns": [
      {"key": "name", "label": "Name", "sortable": true},
      {"key": "amount", "label": "Amount", "sortable": true, "align": "right"},
      {"key": "status", "label": "Status", "type": "badge"}
    ],
    "rows": [
      {"name": "Project Alpha", "amount": "¥128,000", "status": "Active"},
      {"name": "Project Beta", "amount": "¥85,000", "status": "Pending"}
    ],
    "pageSize": 5
  }
}
```

**Prompt hint**: `Display a data table. Required: columns[](key, label), rows[](key:value pairs). Optional: sortable, pageSize, align.`

---

### `flowkit/progress`

Circular or linear progress indicator.

```json
{
  "type": "flowkit/progress",
  "data": {"value": 73, "label": "Task completion", "variant": "ring"}
}
```

---

### `flowkit/timeline`

Step-by-step timeline for processes, plans, or history.

```json
{
  "type": "flowkit/timeline",
  "data": {
    "items": [
      {"title": "Evidence collected", "desc": "Save documents", "time": "Day 1-3", "status": "done"},
      {"title": "File arbitration", "desc": "Submit to labor bureau", "time": "Day 5-45", "status": "current"},
      {"title": "Court hearing", "desc": "If arbitration fails", "status": "pending"}
    ]
  }
}
```

**Prompt hint**: `Display a timeline of steps. Required: items[](title). Optional: desc, time, status(done|current|pending).`

---

### `flowkit/comparison`

Side-by-side comparison table for products, plans, or options.

```json
{
  "type": "flowkit/comparison",
  "data": {
    "items": ["Plan A", "Plan B", "Plan C"],
    "features": [
      {"name": "Price", "values": ["¥99/mo", "¥199/mo", "¥499/mo"]},
      {"name": "Storage", "values": ["10GB", "100GB", "Unlimited"]},
      {"name": "Support", "values": ["Email", "24/7 Chat", "Dedicated"]}
    ],
    "recommended": 1
  }
}
```

---

## 📝 Form & Input (6 widgets)

### `flowkit/form`

Dynamic form with validation. Fields generated from schema.

```json
{
  "type": "flowkit/form",
  "data": {
    "title": "Contact Information",
    "fields": [
      {"key": "name", "label": "Full Name", "type": "text", "required": true},
      {"key": "email", "label": "Email", "type": "email", "required": true},
      {"key": "phone", "label": "Phone", "type": "tel"},
      {"key": "message", "label": "Message", "type": "textarea", "rows": 3}
    ],
    "submitLabel": "Send Message"
  },
  "actions": {"onSubmit": {"event": "form_submitted"}}
}
```

**Prompt hint**: `Display an interactive form. Required: fields[](key, label, type). Optional: required, validation, submitLabel.`

---

### `flowkit/stepper`

Multi-step wizard with progress indicator.

```json
{
  "type": "flowkit/stepper",
  "data": {
    "steps": [
      {"title": "Personal Info", "fields": [...]},
      {"title": "Preferences", "fields": [...]},
      {"title": "Confirmation", "summary": true}
    ],
    "currentStep": 0
  }
}
```

---

### `flowkit/date-picker`
### `flowkit/file-picker`
### `flowkit/rating`
### `flowkit/choice-chips`

```json
{
  "type": "flowkit/choice-chips",
  "data": {
    "label": "What cuisine do you prefer?",
    "options": ["Japanese 🍣", "Italian 🍝", "Chinese 🥟", "Korean 🍖", "Thai 🍜"],
    "multiple": true,
    "maxSelect": 3
  },
  "actions": {"onSelect": {"event": "cuisine_selected"}}
}
```

**Prompt hint**: `Display selectable chip buttons. Required: options[](string). Optional: multiple(bool), maxSelect(number), label.`

---

## 🗺️ Location & Map (4 widgets)

### `flowkit/map`

Interactive map with markers.

```json
{
  "type": "flowkit/map",
  "data": {
    "center": {"lat": 31.23, "lng": 121.47},
    "zoom": 14,
    "markers": [
      {"lat": 31.23, "lng": 121.47, "label": "A", "title": "Current location"},
      {"lat": 31.22, "lng": 121.48, "label": "B", "title": "Restaurant"}
    ]
  }
}
```

---

### `flowkit/map-list`

Map with accompanying location list. Tap list item to highlight on map.

```json
{
  "type": "flowkit/map-list",
  "data": {
    "locations": [
      {"name": "Sushi Zen", "lat": 31.23, "lng": 121.47, "rating": 4.8, "distance": "200m", "price": "$$"},
      {"name": "Pasta House", "lat": 31.22, "lng": 121.48, "rating": 4.6, "distance": "450m", "price": "$$$"}
    ]
  }
}
```

**Prompt hint**: `Display locations on a map with a scrollable list. Required: locations[](name, lat, lng). Optional: rating, distance, price, image.`

---

### `flowkit/map-route`

Route visualization with origin, destination, duration, cost, and action buttons.

```json
{
  "type": "flowkit/map-route",
  "data": {
    "origin": {"name": "Office", "lat": 31.23, "lng": 121.47},
    "destination": {"name": "Hongqiao Airport", "lat": 31.19, "lng": 121.33},
    "duration": "42 min",
    "distance": "28.5 km",
    "cost": {"amount": 86, "currency": "CNY"},
    "mode": "driving"
  },
  "actions": {
    "callRide": {"event": "call_ride", "label": "Call a ride"},
    "altRoute": {"event": "change_route", "label": "Alternative route"}
  }
}
```

**Prompt hint**: `Display a route on a map with ETA and cost. Required: origin(name,lat,lng), destination(name,lat,lng). Optional: duration, distance, cost, actions.`

---

### `flowkit/location-picker`

Let user select a location by tapping on map or searching.

---

## 🛍️ Product & Media (5 widgets)

### `flowkit/product-card`

Single product display with image, title, price, rating.

---

### `flowkit/product-carousel`

Horizontally scrollable product cards.

```json
{
  "type": "flowkit/product-carousel",
  "data": {
    "products": [
      {
        "name": "Nike Pegasus 41",
        "price": 699,
        "currency": "CNY",
        "image": "https://...",
        "rating": 4.8,
        "reviewCount": 23000,
        "tags": ["Bestseller"]
      }
    ]
  },
  "actions": {
    "onTap": {"event": "product_selected", "params": ["id"]},
    "onAddToCart": {"event": "add_to_cart", "params": ["id"]}
  }
}
```

**Prompt hint**: `Display swipeable product cards. Required: products[](name, price). Optional: image, rating, reviewCount, tags, actions.`

---

### `flowkit/gallery`
### `flowkit/video`
### `flowkit/audio`

---

## 🔄 Flow & Action (5 widgets)

### `flowkit/actions`

Primary/secondary action buttons. Used for decisions, confirmations.

```json
{
  "type": "flowkit/actions",
  "data": {
    "buttons": [
      {"label": "Accept", "variant": "primary", "action": "accept"},
      {"label": "Negotiate", "variant": "secondary", "action": "negotiate"},
      {"label": "Decline", "variant": "danger", "action": "decline"}
    ]
  }
}
```

---

### `flowkit/quick-actions`

Pill-shaped quick-reply buttons for contextual suggestions.

```json
{
  "type": "flowkit/quick-actions",
  "data": {
    "items": [
      {"label": "🍜 Japanese", "value": "japanese"},
      {"label": "🍝 Italian", "value": "italian"},
      {"label": "☕ Cafe", "value": "cafe"}
    ]
  }
}
```

**Prompt hint**: `Display quick-reply pill buttons. Required: items[](label). Optional: value, icon.`

---

### `flowkit/checklist`
### `flowkit/confirm`
### `flowkit/status`

---

## 💬 Emotion & Feedback (4 widgets)

### `flowkit/emotion`

Empathetic feedback with avatar expression and text.

```json
{
  "type": "flowkit/emotion",
  "data": {
    "mood": "empathy",
    "avatar": "🤝",
    "title": "Your feelings are completely valid.",
    "text": "This is indeed unfair treatment. Let's work through this together."
  }
}
```

**Prompt hint**: `Display an empathetic response with avatar. Required: mood(empathy|encouragement|celebration|concern). Optional: avatar(emoji), title, text.`

**Available moods**: `empathy`, `encouragement`, `celebration`, `concern`, `curiosity`, `calm`

---

### `flowkit/context-icon`

Contextual illustration/icon that matches the conversation topic.

```json
{
  "type": "flowkit/context-icon",
  "data": {"icon": "⚖️", "label": "Legal Analysis", "style": "prominent"}
}
```

---

### `flowkit/loading`

Narrative loading state — tells the user what the agent is doing.

```json
{
  "type": "flowkit/loading",
  "data": {
    "steps": [
      {"text": "Analyzing your case...", "done": true},
      {"text": "Evaluating legal precedents...", "done": true},
      {"text": "Calculating success probability...", "done": false}
    ]
  }
}
```

---

### `flowkit/feedback`

Collect user feedback on agent response quality.

```json
{
  "type": "flowkit/feedback",
  "data": {
    "prompt": "Was this analysis helpful?",
    "options": ["👍 Yes", "👎 No", "💬 Add comment"]
  }
}
```

---

## Creating Custom Widgets

Any React component can become a FlowKit widget:

```tsx
import { registerWidget, WidgetProps } from '@flowkit/react'

interface MyWidgetData {
  title: string;
  items: string[];
}

const MyWidget: React.FC<WidgetProps<MyWidgetData>> = ({ data, onAction }) => (
  <div>
    <h3>{data.title}</h3>
    <ul>
      {data.items.map((item, i) => (
        <li key={i} onClick={() => onAction('item_clicked', { index: i })}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

registerWidget({
  type: "mycompany/custom-list",
  component: MyWidget,
  schema: { /* JSON Schema for MyWidgetData */ },
  promptHint: "Display a clickable list. Required: title(string), items(string[]).",
  trustLevel: "L1",
});
```

Then publish: `npx flowkit publish`
