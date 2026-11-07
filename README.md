# AgentFlow

> Production-Oriented Visual AI Agent Builder & Pipeline Orchestrator

AgentFlow is an extensible visual platform for designing, running, and observing complex AI agent pipelines. It bridges intuitive drag-and-drop workflow canvases with production-grade orchestration powered by **LangGraph**, **Ollama (local LLMs)**, and **Google Gemini (cloud LLMs)**.

---

## Architecture Overview

```
AgentFlow/
├── frontend/               # React + TypeScript + Vite + Tailwind CSS + @xyflow/react
│   ├── src/
│   │   ├── components/     # Reusable UI primitives (Buttons, Cards, Badges, Modals)
│   │   │   ├── common/     # Core design system components
│   │   │   └── dashboard/  # Dashboard & Project cards, forms, and stats
│   │   ├── layouts/        # AppLayout, collapsible Sidebar, TopNav
│   │   ├── pages/          # Dashboard, Editor, Projects, Templates, Providers, Settings
│   │   ├── services/       # Persistent storage & API communication layer
│   │   ├── types/          # TypeScript domain interfaces
│   │   └── lib/            # Utilities and classnames helper (tailwind-merge)
│   └── package.json
└── backend/                # FastAPI + LangGraph + Pydantic v2 (Phase 6)
```

---

## Design System Principles

- **Palette**: Clean white and neutral slate (`#f8fafc` / `#ffffff`), deep charcoal typography (`#0f172a`), subtle grey borders (`#e2e8f0`), restrained indigo/violet accents (`#4f46e5`).
- **Developer Tool Feel**: Fast, dense, high-hierarchy layout without excessive decorative fluff or fake statistics.
- **Security-First**: Zero API key leakage. All secrets are managed in the backend server environment.

---

## Development Milestones

- [x] **Milestone 01**: Foundation, Architecture & Product Interface (App Shell, Dashboard, Navigation, Routing, Design System)
- [ ] **Milestone 02**: React Flow Visual Canvas Engine (`@xyflow/react`)
- [ ] **Milestone 03**: Custom Node System (Input, Prompt, LLM, Tools, Conditional, Output)
- [ ] **Milestone 04**: FastAPI Backend Runtime & Graph Validation
- [ ] **Milestone 05**: Local Ollama & Cloud Gemini Provider Integrations
- [ ] **Milestone 06**: LangGraph Orchestration & Real-Time Monitoring
