# AgentFlow

> Production-Oriented Visual AI Agent Builder & Pipeline Orchestrator

AgentFlow is an extensible visual platform for designing, running, and observing complex AI agent pipelines. It bridges intuitive drag-and-drop workflow canvases with production-grade orchestration powered by **FastAPI**, **Directed Acyclic Graph (DAG) topological sorting**, **Ollama (local LLMs)**, and **Google Gemini (cloud LLMs)**.

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
└── backend/                # FastAPI + Pydantic v2 + SQLAlchemy (PostgreSQL-compatible)
    ├── app/
    │   ├── main.py         # Application entry point with CORS & lifespan hooks
    │   ├── api/v1/         # REST endpoints (workflows, executions, providers status)
    │   ├── core/           # Configuration, logging & environment management
    │   ├── database/       # SQLAlchemy engine & declarative base
    │   ├── models/         # WorkflowModel, ExecutionModel tables
    │   ├── schemas/        # Pydantic v2 validation contracts
    │   ├── providers/      # Ollama (Local) & Gemini (Cloud) adapters
    │   └── workflow/       # DAG Validator, Kahn's cycle detector & WorkflowEngine
    ├── tests/              # Pytest test suite (DAG validation, cycle checks, pipeline execution)
    ├── requirements.txt    # Backend dependencies
    └── run.py              # Local server runner (Port 8000)
```

---

## Development Milestones

- [x] **Milestone 01**: Foundation, Architecture & Product Interface (App Shell, Dashboard, Navigation, Routing, Design System)
- [x] **Milestone 02**: React Flow Visual Canvas Engine (`@xyflow/react` + 9 Custom Nodes + Inspector + JSON Serialization)
- [x] **Milestone 03**: FastAPI Backend & Workflow Execution Engine (Topological DAG Sort, Node Executors, Live Monitoring Drawer)
- [ ] **Milestone 04**: Advanced Ollama & Local Qwen 2.5 Tool Calling
- [ ] **Milestone 05**: Google Gemini Multimodal Reasoning & Function Binding
- [ ] **Milestone 06**: LangGraph Agent Orchestration & PostgreSQL Production Migration
