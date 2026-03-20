# FlowKit Technical Architecture

> **Version**: 0.1  
> **Status**: Draft  
> **Last Updated**: March 2026

---

## 1. System Overview

FlowKit is a three-layer system designed for maximum decoupling:

```
                   ┌─────────────────────────────────┐
                   │         CLIENT LAYER             │
                   │                                  │
                   │  Renderers (React/Vue/Flutter)   │
                   │  + @flowkit/core                 │
                   └──────────────┬──────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
   ┌────────┴────────┐  ┌────────┴────────┐  ┌────────┴────────┐
   │  PROTOCOL LAYER │  │  REGISTRY LAYER │  │ RECOMMEND LAYER │
   │                 │  │                 │  │                 │
   │  JSON Schema    │  │  Widget Store   │  │  Context→Widget │
   │  Validators     │  │  Publishing     │  │  Matching       │
   │  Type Defs      │  │  Versioning     │  │  Usage Learning │
   └─────────────────┘  └─────────────────┘  └─────────────────┘
            │                     │                     │
            └─────────────────────┼─────────────────────┘
                                  │
                   ┌──────────────┴──────────────────┐
                   │         AGENT LAYER              │
                   │                                  │
                   │  Agent SDKs (Python/TS/Java)     │
                   │  + Widget Schema Prompts         │
                   └──────────────────────────────────┘
```

---

## 2. Package Architecture

### 2.1 Monorepo Structure

```
flowkit/
├── packages/                    # TypeScript packages (pnpm workspace)
│   ├── protocol/                # @flowkit/protocol
│   │   ├── src/
│   │   │   ├── schemas/         # JSON Schema files for all message types
│   │   │   ├── types.ts         # TypeScript type definitions
│   │   │   ├── validator.ts     # Schema validation logic
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── core/                    # @flowkit/core
│   │   ├── src/
│   │   │   ├── parser.ts        # Message parser (extracts widgets)
│   │   │   ├── resolver.ts      # Widget type → component resolution
│   │   │   ├── action-bus.ts    # Action event dispatch system
│   │   │   ├── fallback.ts      # Auto-fallback text generation
│   │   │   ├── cache.ts         # Widget definition cache (LRU)
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── react/                   # @flowkit/react
│   │   ├── src/
│   │   │   ├── FlowKitChat.tsx  # Main wrapper component
│   │   │   ├── WidgetSlot.tsx   # Individual widget render slot
│   │   │   ├── WidgetRegistry.tsx  # React context for widget map
│   │   │   ├── hooks/
│   │   │   │   ├── useWidget.ts
│   │   │   │   ├── useAction.ts
│   │   │   │   └── useFlowKit.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── widgets/                 # @flowkit/widgets
│   │   ├── src/
│   │   │   ├── data-display/
│   │   │   │   ├── MetricCard/
│   │   │   │   │   ├── MetricCard.tsx
│   │   │   │   │   ├── schema.json
│   │   │   │   │   ├── MetricCard.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Chart/
│   │   │   │   ├── DataTable/
│   │   │   │   ├── Timeline/
│   │   │   │   └── ...
│   │   │   ├── form-input/
│   │   │   ├── location-map/
│   │   │   ├── product-media/
│   │   │   ├── flow-action/
│   │   │   ├── emotion-feedback/
│   │   │   └── index.ts         # Exports all widgets + schemas
│   │   └── package.json
│   │
│   ├── sdk/                     # @flowkit/sdk (TypeScript agent SDK)
│   │   └── ...
│   │
│   └── registry-client/         # @flowkit/registry
│       └── ...
│
├── python/                      # Python SDK
│   └── flowkit/
│       ├── __init__.py
│       ├── response.py          # FlowKitResponse builder
│       ├── recommend.py         # Recommend API client
│       ├── validate.py          # Schema validation
│       ├── prompts.py           # get_widget_prompts()
│       └── bridges/
│           ├── a2ui.py          # A2UI compatibility bridge
│           └── agui.py          # AG-UI compatibility bridge
│
├── apps/
│   ├── demo/                    # Next.js demo application
│   ├── registry-server/         # Widget Registry backend
│   ├── playground/              # Interactive widget playground
│   └── create-flowkit-app/      # CLI scaffold tool
│
└── docs/                        # Documentation
```

### 2.2 Package Dependency Graph

```
@flowkit/react ──→ @flowkit/core ──→ @flowkit/protocol
       │                 │
       ↓                 ↓
@flowkit/widgets   @flowkit/registry (runtime fetch)
```

- `@flowkit/protocol` — Zero dependencies. Pure types + schemas.
- `@flowkit/core` — Depends only on `protocol`. Framework-agnostic.
- `@flowkit/react` — Depends on `core`. React 18+ peer dependency.
- `@flowkit/widgets` — Depends on `react` (for React implementations). Each widget is tree-shakeable.

---

## 3. Core Engine (`@flowkit/core`)

### 3.1 Message Parser

```typescript
interface ParsedMessage {
  text: string;
  widgets: WidgetInstance[];
  hasWidgets: boolean;
}

function parseMessage(message: ChatMessage): ParsedMessage {
  // 1. Extract widgets[] from message
  // 2. Validate each widget against schema
  // 3. Generate fallback text for invalid widgets
  // 4. Return structured result
}
```

### 3.2 Widget Resolver

Resolves `type` string → actual component:

```
"flowkit/chart"
      ↓
1. Check local widget map (pre-registered built-in widgets)
      ↓  (not found)
2. Check LRU cache (recently fetched from Registry)
      ↓  (not found)
3. Fetch from Registry API: GET /widgets/flowkit/chart
      ↓
4. Download widget bundle, cache it, return component
      ↓  (all failed)
5. Return FallbackTextWidget
```

**Resolution priority**: Local → Cache → Registry → Fallback

### 3.3 Action Event Bus

```typescript
interface WidgetAction {
  event: string;            // "call_ride", "add_to_cart", etc.
  widgetId: string;         // Instance ID of the widget
  widgetType: string;       // "flowkit/map-route"
  data: Record<string, any>;
  timestamp: string;
}

class ActionBus {
  // Agent developers subscribe to action events
  onAction(callback: (action: WidgetAction) => void): void;
  
  // Renderer dispatches actions from widget interactions
  dispatch(action: WidgetAction): void;
}
```

### 3.4 Validation Pipeline

```
Widget JSON arrives
      ↓
Step 1: Structure check (has type + data?)
      ↓  fail → generate fallback from raw data
Step 2: Schema lookup (does type exist in Registry?)
      ↓  fail → render as unknown widget with data dump
Step 3: Data validation (does data match JSON Schema?)
      ↓  fail → attempt auto-repair (coerce types, fill defaults)
      ↓  still fail → render fallback text
Step 4: Trust check (does widget trust level match config?)
      ↓  fail → render as text with "blocked" notice
Step 5: ✅ Render widget component
```

---

## 4. React Renderer (`@flowkit/react`)

### 4.1 Component Hierarchy

```
<FlowKitProvider>                    // Context: widget registry, config, theme
  └── <FlowKitChat>                  // Main chat wrapper
        └── <MessageList>
              └── <Message>          // Standard chat message
                    ├── <TextBubble> // Text content
                    ├── <WidgetSlot> // Widget render slot
                    │     └── <ResolvedWidget />  // Actual widget component
                    └── <WidgetSlot>
                          └── <ResolvedWidget />
```

### 4.2 `<FlowKitChat>` API

```tsx
interface FlowKitChatProps {
  // Required
  messages: ChatMessage[];
  
  // Events
  onAction?: (action: WidgetAction) => void;
  onSend?: (text: string) => void;
  
  // Configuration
  config?: {
    trustLevel?: "L1" | "L1+L2";
    allowedNamespaces?: string[];
    registryUrl?: string;
    theme?: "light" | "dark" | "auto";
    locale?: string;
  };
  
  // Customization
  renderMessage?: (message: ChatMessage) => ReactNode;
  renderWidget?: (widget: WidgetInstance, defaultRender: () => ReactNode) => ReactNode;
  widgets?: Record<string, React.ComponentType<any>>;  // Local widget overrides
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
}
```

### 4.3 Widget Component Contract

Every widget component receives a standardized prop interface:

```tsx
interface WidgetProps<T = any> {
  data: T;                    // Validated data from schema
  options: WidgetOptions;     // Display options
  onAction: (name: string, payload?: any) => void;  // Emit actions
  theme: FlowKitTheme;       // Current theme tokens
  size: "compact" | "normal" | "expanded";
}

// Example widget implementation
const GaugeWidget: React.FC<WidgetProps<GaugeData>> = ({
  data, options, onAction, theme
}) => {
  return (
    <div className="flowkit-gauge">
      <GaugeRing value={data.value} color={theme.accent} />
      <span className="value">{data.value}%</span>
      {data.label && <span className="label">{data.label}</span>}
    </div>
  );
};
```

---

## 5. Widget Registry

### 5.1 Architecture

```
┌─────────────────────────────────────────────┐
│              Registry Server                │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ API      │  │ Storage  │  │ CDN      │  │
│  │ (REST)   │  │ (D1/R2)  │  │ (Widget  │  │
│  │          │  │          │  │  bundles) │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ Review Pipeline                      │   │
│  │ Auto-scan → Human review (L2 only)   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 5.2 Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| API Server | Cloudflare Workers | Global edge deployment, zero cold start |
| Metadata DB | Cloudflare D1 (SQLite) | Low cost, built-in replication |
| Widget Bundles | Cloudflare R2 | S3-compatible, no egress fees |
| CDN | Cloudflare CDN | Global, automatic |
| Search | Meilisearch (self-hosted) | Fast full-text + faceted search |

### 5.3 Publishing Flow

```
Developer runs: npx flowkit publish
      ↓
CLI validates: schema, component, examples, tests
      ↓
Bundle created: ESM module + schema + metadata
      ↓
Upload to Registry API
      ↓
L1 widgets: auto-approved after schema validation
L2 widgets: queued for automated security scan + human review
      ↓
Widget available in Registry
```

---

## 6. Recommend Engine

### 6.1 Architecture

```
Agent sends: { "context": "User wants to book a restaurant" }
      ↓
Phase 1: Rule-based matching
  - Keyword extraction → match widget tags
  - Returns top candidates with confidence scores
      ↓
Phase 2: Embedding-based retrieval (v2)
  - Context embedding → cosine similarity with widget description embeddings
  - Re-ranks candidates
      ↓
Phase 3: Usage-weighted scoring (v3)
  - Factor in historical data: "in similar contexts, which widgets had highest interaction rate?"
      ↓
Returns: ranked list of widget suggestions with confidence scores
```

### 6.2 Data Collection (Privacy-First)

```json
{
  "event": "widget_rendered",
  "widgetType": "flowkit/map-route",
  "contextHash": "sha256(anonymized_context)",
  "interacted": true,
  "interactionType": "click:call_ride",
  "durationMs": 3200,
  "timestamp": "2026-03-19T10:30:00Z"
}
```

- **No raw conversation text** is ever collected
- Context is hashed/anonymized before storage
- Opt-out available at both agent and user level
- Data stored with 90-day TTL

### 6.3 Evolution Phases

| Phase | Method | Data Required | Expected Accuracy |
|-------|--------|--------------|-------------------|
| v1 (P0) | Rule-based keywords | Widget tag metadata | ~50-60% |
| v2 (P2) | Embedding retrieval | Widget descriptions | ~70-75% |
| v3 (P3) | Usage-weighted ML | Anonymized usage data | ~80-85% |

---

## 7. Security Architecture

### 7.1 Threat Model

| Threat | Mitigation |
|--------|-----------|
| Malicious widget code (XSS) | L1: no code execution. L2: iframe sandbox with CSP |
| Data exfiltration via widget | L2 sandbox: no network access except allowlisted domains |
| Widget impersonation | Namespace ownership verified. `flowkit/*` reserved. |
| Registry poisoning | Automated security scan + human review for L2. Signed bundles. |
| Man-in-the-middle | All Registry communication over HTTPS. Bundle integrity via SHA256. |

### 7.2 L2 Sandbox Specification

```html
<iframe
  sandbox="allow-scripts"
  csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  srcdoc="..."
>
```

L2 widgets cannot:
- Access parent DOM
- Make network requests (except to allowlisted APIs declared in manifest)
- Access localStorage/cookies
- Open new windows/tabs
- Access clipboard without user gesture

L2 widgets can:
- Execute JavaScript within sandbox
- Use Canvas API
- Handle touch/mouse events
- Communicate with host via `postMessage` (typed, validated)

---

## 8. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Widget first render | < 100ms | Time from data arrival to first pixel |
| Widget bundle size (L1) | < 15KB gzip | Per-widget overhead |
| Widget bundle size (L2) | < 50KB gzip | Including sandboxed JS |
| Registry API latency | < 50ms (p95) | Cloudflare edge |
| Total added JS to host app | < 40KB gzip | @flowkit/core + @flowkit/react |
| Widget cache hit rate | > 90% | After warm-up period |

---

## 9. Testing Strategy

| Level | Scope | Tools |
|-------|-------|-------|
| Unit | Individual widget components | Vitest + React Testing Library |
| Schema | JSON Schema validation | AJV + custom test harness |
| Integration | Parser → Resolver → Renderer pipeline | Playwright |
| Visual | Widget appearance regression | Chromatic (Storybook) |
| Security | L2 sandbox escape attempts | Custom security test suite |
| LLM | Widget JSON generation reliability | Eval harness with multiple LLMs |

### 9.1 LLM Eval Framework

```python
# Test that LLMs can reliably generate widget JSON from prompts
def test_llm_widget_generation():
    for model in ["gpt-4o", "claude-sonnet", "gemini-flash"]:
        for widget_type in ALL_WIDGET_TYPES:
            prompt = build_test_prompt(widget_type)
            response = call_llm(model, prompt)
            widget_json = extract_widget(response)
            
            assert validate_widget(widget_json).valid, \
                f"{model} failed to generate valid {widget_type}"
```

---

## 10. Deployment Architecture

### 10.1 Self-Hosted (Default)

```
Your Infrastructure
├── Registry Server (Docker)    # Optional — can use hosted registry
├── Recommend API (Docker)      # Optional — can use hosted API
└── Your Agent + FlowKit SDK    # Required
```

### 10.2 Hosted (FlowKit Cloud)

```
FlowKit Cloud
├── Widget Registry (global CDN)
├── Recommend API (edge deployment)
└── Analytics Dashboard
        ↑
Your Agent ──→ FlowKit SDK (connects to cloud)
```

Both modes use identical APIs. Switch between self-hosted and cloud by changing one environment variable:

```bash
FLOWKIT_REGISTRY_URL=https://registry.flowkit.dev   # Cloud (default)
FLOWKIT_REGISTRY_URL=http://localhost:8080           # Self-hosted
```
