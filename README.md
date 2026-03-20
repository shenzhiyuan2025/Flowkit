# FlowKit

FlowKit 是一个开源的 Widget-in-Chat 协议与渲染工具集，让 Agent 在对话中直接输出可交互组件。

## Monorepo 结构

```text
flowkit/
├── packages/
│   ├── protocol   # 协议类型与校验
│   ├── core       # 解析器与事件总线
│   ├── react      # React 渲染器（FlowKitChat）
│   └── widgets    # 内置组件集合
├── apps/
│   └── demo       # 可直接运行的示例应用
├── python/
│   └── flowkit    # Python SDK 最小实现
└── docs/
    ├── ARCHITECTURE.md
    ├── PROTOCOL.md
    ├── WIDGET_CATALOG.md
    └── CONTRIBUTING.md
```

## 快速开始

### 环境要求

- Node.js 20+
- npm 10+
- Python 3.11+

### 安装与运行

```bash
npm install
npm run dev
```

启动后访问 Vite 默认地址即可看到 `FlowKit Demo` 页面。

## 常用命令

```bash
npm run dev
npm run build
npm run test
```

## 文档

- 协议规范：`docs/PROTOCOL.md`
- 技术架构：`docs/ARCHITECTURE.md`
- 组件目录：`docs/WIDGET_CATALOG.md`
- 贡献指南：`docs/CONTRIBUTING.md`

## 许可证

Apache-2.0
