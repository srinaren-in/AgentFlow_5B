# AgentFlow

> Production-Oriented Visual AI Agent Builder & Pipeline Orchestrator

AgentFlow is an extensible visual platform for designing, running, and observing complex AI agent pipelines. It bridges intuitive drag-and-drop workflow canvases with production-grade orchestration powered by **FastAPI**, **LangGraph ReAct loops**, **Ollama (local LLMs & Qwen 2.5)**, and **Google Gemini (cloud multimodal LLMs)**.

---

## Architecture Overview

```
AgentFlow/
├── frontend/               # React + TypeScript + Vite + Tailwind CSS + @xyflow/react
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/     # Core design system components (Button, Badge, Card, Modal, Input)
│   │   │   ├── dashboard/  # Dashboard & Project cards, forms, and stats
│   │   │   └── canvas/     # @xyflow/react Canvas, 9 Custom Nodes, Config Inspector, Execution Drawer
│   │   ├── layouts/        # AppLayout, collapsible Sidebar, TopNav
│   │   ├── pages/          # Dashboard, Editor, Projects, Templates, Providers, Settings
│   │   ├── services/       # Persistent storage & FastAPI backend REST communication layer
│   │   ├── types/          # TypeScript domain interfaces
│   │   └── lib/            # Utilities and classnames helper (tailwind-merge)
│   └── package.json
└── backend/                # FastAPI + Pydantic v2 + LangGraph + SQLAlchemy
    ├── app/
    │   ├── main.py         # Application entry point with CORS & table creation
    │   ├── run.py          # Local server launcher (Port 8000)
    │   ├── agent/          # LangGraph StateGraph, reasoning loops & tool execution
    │   ├── tools/          # Safe Calculator AST, HTTP caller, Subprocess Python Sandbox, Registry
    │   ├── memory/         # Persistent conversation memory manager (database-backed)
    │   ├── providers/      # Ollama (Local Qwen 2.5) & Gemini (Cloud AI) function binding
    │   ├── api/v1/         # REST endpoints (workflows, executions, providers, tools, memory)
    │   ├── core/           # Configuration, logging & environment management
    │   ├── database/       # SQLAlchemy engine & declarative base
    │   ├── models/         # WorkflowModel, ExecutionModel, MemorySessionModel tables
    │   ├── schemas/        # Pydantic v2 validation contracts
    │   └── workflow/       # DAG Validator, Kahn's cycle detector & WorkflowEngine
    ├── tests/              # Pytest test suite (17 automated tests)
    └── requirements.txt    # Backend dependencies
```

---

## Development Milestones

- [x] **Milestone 01**: Foundation, Architecture & Product Interface (App Shell, Dashboard, Navigation, Routing, Design System)
- [x] **Milestone 02**: React Flow Visual Canvas Engine (`@xyflow/react` + 9 Custom Nodes + Inspector + JSON Serialization)
- [x] **Milestone 03**: FastAPI Backend & Workflow Execution Engine (Topological DAG Sort, Node Executors, Live Monitoring Drawer)
- [x] **Milestone 04**: LLM Providers, LangGraph & AI Agent Intelligence (LangGraph ReAct Loop, Tool Registry, Subprocess Python Sandbox, AST Calculator, DB Memory)
- [ ] **Milestone 05**: Advanced Streaming Output & Token-by-Token Visual Trace
- [ ] **Milestone 06**: Production PostgreSQL Migration & Docker Deployment
