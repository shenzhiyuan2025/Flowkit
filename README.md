<p align="center">
  <img src="docs/assets/flowkit-banner.svg" alt="FlowKit" width="100%" />
</p>

<h1 align="center">FlowKit</h1>

<p align="center">
  <strong>Agent's Widget-in-Chat Protocol & Open Ecosystem</strong><br/>
  Let every Agent speak GUI.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="docs/PROTOCOL.md">Protocol Spec</a> ·
  <a href="docs/ARCHITECTURE.md">Architecture</a> ·
  <a href="docs/WIDGET_CATALOG.md">Widget Catalog</a> ·
  <a href="docs/CONTRIBUTING.md">Contributing</a> ·
  <a href="#demo">Live Demo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/protocol-v0.1-purple.svg" alt="Protocol Version" />
  <img src="https://img.shields.io/badge/widgets-30+-green.svg" alt="Widget Count" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</p>

---

## What is FlowKit?

**FlowKit is an open-source Widget-in-Chat protocol and ecosystem that lets any AI conversation product embed interactive GUI components directly in the dialogue flow.**

Today, 99% of AI agents communicate through pure text. But text is a bottleneck — showing 10 restaurants on a map takes 3 seconds with GUI, 30 seconds with text. FlowKit bridges this gap by providing:

- 🔌 **A dead-simple protocol** — add a `widgets` field to your agent's JSON response
- 📦 **30+ built-in widgets** — maps, charts, forms, product cards, timelines, and more
- 🌍 **An open Widget Registry** — anyone publishes widgets, any agent uses them
- 🧠 **A recommendation engine** — context-aware widget suggestions that get smarter over time
- 🎨 **Multi-framework renderers** — React, Vue, Flutter, Mini Programs

```
┌──────────────────────────────────────────────────┐
│  Your Chat App (any conversation product)        │
│  ┌────────────────────────────────────────────┐  │
│  │  FlowKit Renderer (React/Vue/Flutter/...)  │  │
│  │  Auto-renders widgets in dialogue flow     │  │
│  └──────────────────┬─────────────────────────┘  │
└─────────────────────┼────────────────────────────┘
                      │  FlowKit Protocol (JSON)
┌─────────────────────┼────────────────────────────┐
│  Agent Backend (any AI agent)                    │
│  + FlowKit SDK (Python / TypeScript / Java)      │
└──────────────────┬──────────────┬────────────────┘
                   ↓              ↓
        ┌──────────────┐  ┌─────────────────┐
        │ Widget       │  │ Recommend API   │
        │ Registry     │  │ (context-aware  │
        │ (open market)│  │  suggestions)   │
        └──────────────┘  └─────────────────┘
```

## Why FlowKit?

| Problem | Current State | FlowKit Solution |
|---------|--------------|-----------------|
| Agents can only output text | Pure text dialogue is low-bandwidth | Rich GUI widgets embedded in chat |
| Adding GUI to agents is hard | Requires frontend expertise | **3 lines of code** on agent side |
| No reusable widget ecosystem | Everyone reinvents the wheel | **Open Registry** with 30+ built-in widgets |
| Existing protocols are complex | A2UI requires custom Renderer + Catalog | **Plug and play** — one component wraps your chat |

### How FlowKit compares

| | FlowKit | A2UI (Google) | MCP Apps | CopilotKit |
|---|---------|--------------|----------|------------|
| **What it is** | Widget ecosystem + protocol | Protocol spec only | Platform-embedded apps | Agent frontend framework |
| **Widget source** | Open Registry (community) | Self-built catalog | Developer-written web apps | Self-built components |
| **Agent-side effort** | 3 lines of JSON | Implement full Renderer | Build MCP Server + Web UI | Learn framework API |
| **Cross-app embedding** | ✅ Any chat product | Needs custom Renderer | ChatGPT/Claude only | Framework-dependent |
| **Data flywheel** | ✅ Recommendation engine | ❌ | ❌ | ❌ |
| **Built-in widgets** | 30+ production-ready | 18 basic primitives | None | None |

---

## Demo

<p align="center">
  <img src="docs/assets/demo-legal.png" alt="Legal Consultation Demo" width="32%" />
  <img src="docs/assets/demo-ecommerce.png" alt="E-commerce Demo" width="32%" />
  <img src="docs/assets/demo-travel.png" alt="Travel Planning Demo" width="32%" />
</p>

**Four scenario demos included:**

| Scenario | Widgets Used | Description |
|----------|-------------|-------------|
| ⚖️ Legal Consultation | evidence-list, gauge, emotion, timeline | AI analyzes case, shows evidence strength, win probability, action roadmap |
| 🛍️ E-commerce | product-carousel, chart, quick-actions | Browse products, compare specs, add to cart — all in chat |
| ✈️ Travel & Transit | map-route, emotion, quick-actions | Say "get a taxi to airport" → map + route + cost + one-tap ride |
| 📊 Data Analytics | metrics, chart, quick-actions | "Show me sales data" → KPI cards + trend chart + drill-down buttons |

> 🚀 **Try the live demo**: `npx create-flowkit-app my-demo && cd my-demo && npm run dev`

---

## Quick Start

### For Agent Developers (Backend)

Add widgets to your agent's response — that's it:

```python
# pip install flowkit

from flowkit import FlowKitResponse

response = FlowKitResponse(
    text="Here are nearby restaurants:",
    widgets=[
        {
            "type": "flowkit/map-list",
            "data": {
                "locations": [
                    {"name": "Sushi Zen", "lat": 31.23, "lng": 121.47, "rating": 4.8},
                    {"name": "Pasta House", "lat": 31.22, "lng": 121.48, "rating": 4.6},
                ],
                "center": {"lat": 31.23, "lng": 121.47}
            }
        }
    ]
)
```

### For Frontend Developers (Client)

Wrap your existing chat with one component:

```tsx
// npm install @flowkit/react

import { FlowKitChat } from '@flowkit/react'

function App() {
  return (
    <FlowKitChat
      messages={messages}
      onAction={(action) => handleAction(action)}
    />
  )
}
```

### For Widget Developers (Ecosystem)

Publish your component to the FlowKit Registry:

```tsx
// Register any React component as a FlowKit widget
import { registerWidget } from '@flowkit/registry'

registerWidget({
  type: "mycompany/stock-chart",
  component: StockChartComponent,
  schema: stockChartSchema,       // JSON Schema for data validation
  promptHint: "Display a stock price chart with candlestick view",
})
```

---

## Widget Catalog (v0.1)

FlowKit ships with **30+ production-ready widgets** across 6 categories:

### 📊 Data Display
| Widget | Type ID | Description |
|--------|---------|-------------|
| Metric Card | `flowkit/metrics` | KPI cards with trend indicators |
| Chart | `flowkit/chart` | Line, bar, pie, area charts |
| DataTable | `flowkit/data-table` | Sortable, filterable data table |
| Progress Ring | `flowkit/progress` | Circular progress indicator |
| Timeline | `flowkit/timeline` | Step-by-step event timeline |
| Comparison | `flowkit/comparison` | Side-by-side feature comparison |

### 📝 Form & Input
| Widget | Type ID | Description |
|--------|---------|-------------|
| Smart Form | `flowkit/form` | Dynamic form with validation |
| Stepper | `flowkit/stepper` | Multi-step wizard |
| Date Picker | `flowkit/date-picker` | Date/time selection |
| File Picker | `flowkit/file-picker` | File upload with preview |
| Rating | `flowkit/rating` | Star/emoji rating input |
| Choice Chips | `flowkit/choice-chips` | Single/multi select chips |

### 🗺️ Location & Map
| Widget | Type ID | Description |
|--------|---------|-------------|
| Map | `flowkit/map` | Interactive map view |
| Map List | `flowkit/map-list` | Map + location list combo |
| Route View | `flowkit/map-route` | Origin → destination with route |
| Location Picker | `flowkit/location-picker` | Select a location on map |

### 🛍️ Product & Media
| Widget | Type ID | Description |
|--------|---------|-------------|
| Product Card | `flowkit/product-card` | Product with image, price, rating |
| Product Carousel | `flowkit/product-carousel` | Swipeable product cards |
| Gallery | `flowkit/gallery` | Image gallery with lightbox |
| Video Player | `flowkit/video` | Embedded video player |
| Audio Player | `flowkit/audio` | Audio player with waveform |

### 🔄 Flow & Action
| Widget | Type ID | Description |
|--------|---------|-------------|
| Action Buttons | `flowkit/actions` | Contextual action buttons |
| Quick Actions | `flowkit/quick-actions` | Pill-shaped quick reply buttons |
| Checklist | `flowkit/checklist` | Interactive todo checklist |
| Confirm Dialog | `flowkit/confirm` | Confirmation with options |
| Status Badge | `flowkit/status` | Status indicator |

### 💬 Emotion & Feedback
| Widget | Type ID | Description |
|--------|---------|-------------|
| Emotion Feedback | `flowkit/emotion` | Empathetic response with avatar |
| Context Icon | `flowkit/context-icon` | Contextual icon/illustration |
| Loading Narrative | `flowkit/loading` | Story-driven loading state |
| Feedback Prompt | `flowkit/feedback` | Thumbs up/down + comment |

> **See full catalog**: [docs/WIDGET_CATALOG.md](docs/WIDGET_CATALOG.md)
>
> **All built-in widgets use the same API as third-party widgets.** No special privileges. You can override, extend, or replace any official widget.

---

## Protocol Overview

FlowKit Protocol is intentionally minimal. A widget embedding requires only 3 fields:

```json
{
  "type": "flowkit/map-route",
  "data": { "origin": {...}, "destination": {...} },
  "options": { "style": "compact" }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `type` | ✅ | Widget identifier from Registry (`namespace/name`) |
| `data` | ✅ | Widget-specific data payload (validated against JSON Schema) |
| `options` | ❌ | Display options (style, size, theme, locale) |
| `actions` | ❌ | Callback definitions for user interactions |
| `fallback` | ❌ | Plain text fallback if widget unavailable |

### Message Format

FlowKit does **not** replace your existing message format. It adds an optional `widgets` array:

```json
{
  "role": "assistant",
  "content": "I found these restaurants for you:",
  "widgets": [
    { "type": "flowkit/map-list", "data": {...} },
    { "type": "flowkit/quick-actions", "data": {...} }
  ]
}
```

### Trust Levels

Widgets operate at two trust levels:

| Level | Mechanism | Security | Expressiveness |
|-------|-----------|----------|---------------|
| **L1 Declarative** | Pure JSON schema + data binding | Highest (no code execution) | Medium |
| **L2 Interactive** | Sandboxed JS with Registry review | High (sandbox + audit) | High (drag, animation, complex logic) |

### Interaction Model

```
User clicks button in widget
        ↓
FlowKit Renderer captures action event
        ↓
Event dispatched to Agent backend
{
  "action": "call_ride",
  "widgetType": "flowkit/map-route",
  "context": { "origin": {...}, "destination": {...} }
}
        ↓
Agent processes and responds (possibly with new widgets)
```

> **Full protocol specification**: [docs/PROTOCOL.md](docs/PROTOCOL.md)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  React   │ │   Vue    │ │ Flutter  │ │ Mini Program  │  │
│  │ Renderer │ │ Renderer │ │ Renderer │ │   Renderer    │  │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └──────┬────────┘  │
│        └────────────┬────────────┴──────────────┘            │
│                     │                                        │
│           ┌─────────┴─────────┐                              │
│           │  @flowkit/core    │  Protocol parser, validator, │
│           │                   │  widget resolver, action bus │
│           └─────────┬─────────┘                              │
└─────────────────────┼────────────────────────────────────────┘
                      │  HTTP / WebSocket / SSE / AG-UI
┌─────────────────────┼────────────────────────────────────────┐
│                 SERVER LAYER                                  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Agent SDK    │  │ Widget       │  │ Recommend API    │   │
│  │ Python/TS/   │  │ Registry     │  │                  │   │
│  │ Java         │  │              │  │ Context → Widget │   │
│  │              │  │ Search,      │  │ suggestions      │   │
│  │ Helpers for  │  │ Publish,     │  │                  │   │
│  │ building     │  │ Validate,    │  │ Learns from      │   │
│  │ widget JSON  │  │ Version      │  │ usage data       │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Core Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@flowkit/protocol` | JSON Schema definitions, TypeScript types, validators | 🚧 In Development |
| `@flowkit/core` | Protocol parser, widget resolver, action event bus | 🚧 In Development |
| `@flowkit/react` | React Renderer — `<FlowKitChat>` component | 🚧 In Development |
| `@flowkit/vue` | Vue 3 Renderer | 📋 Planned |
| `@flowkit/flutter` | Flutter Renderer | 📋 Planned |
| `flowkit` (Python) | Python SDK for agent developers | 🚧 In Development |
| `@flowkit/sdk` | TypeScript SDK for agent developers | 🚧 In Development |
| `@flowkit/registry` | Widget Registry client + publishing tools | 📋 Planned |
| `@flowkit/widgets` | 30+ official built-in widgets | 🚧 In Development |

> **Full architecture doc**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## LLM Extensibility

FlowKit is designed to work with any LLM. Three mechanisms ensure reliable widget generation:

### 1. Schema-as-Prompt

Every widget ships with an LLM-readable schema summary. Drop it into your system prompt:

```python
from flowkit import get_widget_prompts

# Get prompt-ready descriptions for selected widgets
prompt_context = get_widget_prompts([
    "flowkit/map-route",
    "flowkit/product-carousel",
    "flowkit/metrics"
])

system_prompt = f"""You are a helpful assistant.
When appropriate, include widgets in your response.

Available widgets:
{prompt_context}
"""
```

### 2. Recommend API

Don't know which widget to use? Let FlowKit decide:

```python
from flowkit import recommend_widgets

suggestions = recommend_widgets(
    context="User asked about nearby restaurants for dinner",
    max_results=3
)
# Returns: [
#   {"type": "flowkit/map-list", "confidence": 0.92},
#   {"type": "flowkit/product-carousel", "confidence": 0.78},
#   {"type": "flowkit/quick-actions", "confidence": 0.71}
# ]
```

### 3. Validate & Fallback

All widget JSON is validated against schemas. On failure, graceful degradation to text:

```python
from flowkit import validate_widget

result = validate_widget(widget_json)
if not result.valid:
    # Auto-fallback: widget renders as formatted text
    # No crash, no broken UI
    pass
```

---

## Compatibility

FlowKit is designed to coexist with (not replace) the emerging Agent UI ecosystem:

| Protocol | Relationship |
|----------|-------------|
| **AG-UI** (CopilotKit) | FlowKit messages can be transported over AG-UI event streams |
| **A2UI** (Google) | L1 declarative widgets can use A2UI component format internally |
| **MCP Apps** (Anthropic + OpenAI) | FlowKit widgets can wrap MCP App iframes |
| **Open-JSON-UI** (OpenAI) | Compatible schema mapping available |

---

## Roadmap

| Phase | Timeline | Deliverables |
|-------|----------|-------------|
| **P0 — Foundation** | Month 1-2 | Protocol v0.1, React Renderer, 30 built-in widgets, CLI scaffold, 3 killer demos |
| **P1 — Ecosystem** | Month 3-4 | Widget Registry launch, Vue Renderer, Python/TS SDK, third-party publishing |
| **P2 — Intelligence** | Month 5-8 | Recommend API v1, Flutter Renderer, Mini Program Renderer, A2UI/AG-UI bridge |
| **P3 — Scale** | Month 9-12 | Widget composition engine, industry template marketplace, Enterprise edition |

---

## Contributing

We welcome contributions of all kinds! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

**Especially looking for:**

- 🎨 **Widget developers** — Build widgets and publish to Registry
- 🔧 **Renderer developers** — Help build Vue / Flutter / Mini Program renderers
- 🧪 **Agent developers** — Try FlowKit in your agent and give feedback
- 📖 **Documentation** — Improve docs, write tutorials, translate
- 💡 **Ideas** — Open issues with your use cases and widget ideas

### Development Setup

```bash
git clone https://github.com/user/flowkit.git
cd flowkit
pnpm install        # Install all dependencies
pnpm dev            # Start development server
pnpm test           # Run tests
pnpm build          # Build all packages
```

### Project Structure

```
flowkit/
├── packages/
│   ├── protocol/       # JSON Schema definitions & TypeScript types
│   ├── core/           # Protocol parser, validator, widget resolver
│   ├── react/          # React Renderer
│   ├── vue/            # Vue Renderer (planned)
│   ├── widgets/        # 30+ official built-in widgets
│   └── sdk/            # TypeScript SDK for agent developers
├── python/
│   └── flowkit/        # Python SDK
├── apps/
│   ├── demo/           # Demo application (4 scenarios)
│   ├── registry/       # Widget Registry server
│   ├── playground/     # Interactive widget playground
│   └── docs/           # Documentation site
├── docs/               # Project documentation
│   ├── PROTOCOL.md     # Protocol specification
│   ├── ARCHITECTURE.md # Technical architecture
│   ├── WIDGET_CATALOG.md  # Full widget reference
│   └── CONTRIBUTING.md # Contribution guide
└── examples/
    ├── legal-advisor/  # Legal consultation demo
    ├── shopping/       # E-commerce assistant demo
    ├── travel/         # Travel planning demo
    └── analytics/      # Data analytics demo
```

---

## Community

- 💬 [Discord](https://discord.gg/flowkit) — Chat with the team and community
- 🐦 [Twitter](https://twitter.com/flowkit) — Updates and announcements
- 📝 [Blog](https://flowkit.dev/blog) — Deep dives and tutorials
- 🐛 [Issues](https://github.com/user/flowkit/issues) — Bug reports and feature requests

---

## License

FlowKit is open source under the [Apache License 2.0](LICENSE).

The core protocol, all renderers, built-in widgets, and SDKs are **free forever**.

---

<p align="center">
  <strong>FlowKit — Let every Agent speak GUI.</strong><br/>
  <sub>Built with ❤️ for the Agent-native future.</sub>
</p>
