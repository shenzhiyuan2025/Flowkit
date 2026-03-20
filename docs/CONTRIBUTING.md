# Contributing to FlowKit

Thank you for your interest in contributing to FlowKit! This guide will help you get started.

---

## Ways to Contribute

### 🎨 Build Widgets
The most impactful contribution — create widgets and publish them to the Registry.

### 🔧 Improve Renderers
Help build or enhance renderers for React, Vue, Flutter, or Mini Programs.

### 🧪 Test & Report
Try FlowKit in your agent, find bugs, suggest improvements.

### 📖 Documentation
Improve docs, write tutorials, translate to other languages.

### 💡 Ideas & Design
Open issues with your use cases, widget ideas, or protocol suggestions.

---

## Development Setup

### Prerequisites
- Node.js 20+
- npm 10+
- Python 3.11+ (for Python SDK)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/shenzhiyuan/flowkit.git
cd flowkit

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm run test

# Build all packages
npm run build

# Lint
npm run lint
```

---

## Creating a New Widget

### Step 1: Scaffold

```bash
npm run dev
```

Widget implementation convention:
```
packages/widgets/src/my-widget/
├── MyWidget.tsx        # React component
├── schema.json         # JSON Schema
├── MyWidget.test.tsx   # Tests
├── MyWidget.stories.tsx # Storybook stories
└── index.ts
```

### Step 2: Implement

Edit `MyWidget.tsx` following the WidgetProps interface:

```tsx
import { WidgetProps } from '@flowkit/core'

interface MyWidgetData {
  // Define your data shape
}

export const MyWidget: React.FC<WidgetProps<MyWidgetData>> = ({
  data,
  options,
  onAction,
  theme,
}) => {
  // Your implementation
}
```

### Step 3: Define Schema

Edit `schema.json` — this is critical for LLM compatibility:

```json
{
  "type": "object",
  "title": "flowkit/my-widget",
  "description": "Clear description of what this widget does and when to use it",
  "required": ["..."],
  "properties": { "..." }
}
```

### Step 4: Test

```bash
npm run test
```

### Step 5: Submit PR

```bash
git checkout -b widget/my-widget
git add .
git commit -m "feat(widgets): add my-widget"
git push origin widget/my-widget
# Open PR on GitHub
```

---

## Code Standards

- **TypeScript** for all packages
- **Vitest** for testing
- **Prettier** + **ESLint** for formatting
- **Conventional Commits** for commit messages
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation
  - `widget:` new or updated widget
  - `refactor:` code refactoring

---

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with tests
4. Ensure `npm run test` and `npm run lint` pass
5. Submit PR with clear description
6. Respond to review feedback
7. Once approved, maintainer will merge

---

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Be respectful, constructive, and collaborative.

---

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

## Questions?

- 🐛 [GitHub Issues](https://github.com/shenzhiyuan/flowkit/issues) — Bug reports and feature requests
