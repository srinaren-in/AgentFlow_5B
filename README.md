# AgentFlow

> Production-Oriented Visual AI Agent Builder & Cognitive Pipeline Orchestrator

AgentFlow is an extensible visual platform for designing, running, and observing complex AI agent pipelines. It bridges an intuitive drag-and-drop workflow canvas with production-grade orchestration powered by **FastAPI**, **LangGraph ReAct loops**, **4-Role Cognitive Flow Architecture (Planner → Executor → Verifier → Generator)**, **Ollama (local LLMs & Qwen 2.5)**, **Google Gemini (cloud multimodal LLMs)**, and **PostgreSQL**.

---

## Architecture Overview

```
AgentFlow/
├── frontend/               # React 19 + TypeScript + Vite + Tailwind CSS v4 + @xyflow/react
│   ├── src/
│   │   ├── styles/         # tokens.css (permanent design system variables and component classes)
│   │   ├── components/
│   │   │   ├── common/     # Design system primitives (Button, Badge, Card, Modal, Input)
│   │   │   ├── dashboard/  # Dashboard & Project cards, forms, and live metrics
│   │   │   └── canvas/     # @xyflow/react Canvas, 9 Custom Nodes, Config Inspector, Execution Drawer
│   │   ├── layouts/        # AppLayout, collapsible Sidebar, TopNav
│   │   ├── pages/          # Home (/), Dashboard (/dashboard), Editor (/editor), Projects, Templates, Providers, Settings
│   │   ├── services/       # Persistent storage & FastAPI backend REST communication layer
│   │   ├── types/          # TypeScript domain interfaces
│   │   └── lib/            # Utilities and classnames helper (tailwind-merge)
│   ├── Dockerfile          # Multi-stage production container (Node 20 -> Nginx Alpine)
│   ├── nginx.conf          # Nginx reverse proxy with gzip and API pass-through
│   └── package.json
├── backend/                # FastAPI + Pydantic v2 + LangGraph + SQLAlchemy + Alembic
│   ├── app/
│   │   ├── main.py         # Application entry point with CORS, routers & lifecycle
│   │   ├── flow_agent/     # 4-Role Cognitive Architecture (inspired by lupantech/AgentFlow)
│   │   │   ├── roles.py    # Planner, Executor, Verifier, and Generator implementations
│   │   │   └── solver.py   # FlowSolver multi-turn trajectory loop with self-correcting feedback
│   │   ├── agent/          # LangGraph StateGraph, reasoning loops & tool execution
│   │   ├── tools/          # AST Calculator, Wikipedia Search, SSRF-Guarded HTTP tool, Subprocess Python Sandbox
│   │   ├── memory/         # Persistent conversation memory manager
│   │   ├── providers/      # Ollama (Local Qwen 2.5) & Gemini (Cloud AI) function binding
│   │   ├── api/v1/         # REST endpoints (auth, workflows, executions, providers, tools, memory)
│   │   ├── core/           # Config, logging, security (JWT & bcrypt), SSRF network validator
│   │   ├── database/       # SQLAlchemy engine & declarative base
│   │   ├── models/         # UserModel, ProjectModel, WorkflowModel, ExecutionModel, MemorySessionModel
│   │   ├── schemas/        # Pydantic v2 validation contracts
│   │   └── workflow/       # DAG Validator, Kahn's cycle detector & WorkflowEngine
│   ├── alembic/            # Database migration environment and versioned revisions
│   ├── tests/              # Pytest test suite (24 automated tests: unit, API, DAG, security, FlowSolver)
│   ├── Dockerfile          # Production Python 3.12-slim container with health check
│   └── requirements.txt    # Backend dependencies
├── docker-compose.yml      # Multi-service orchestration (Postgres 16 + Backend + Frontend)
└── .env.example            # Environment configuration template
```

---

## Permanent Design System Tokens

The application interface is built strictly upon foundational design tokens defined in `frontend/src/styles/tokens.css`:

| Token | Hex Value | Application Usage |
| :--- | :--- | :--- |
| **Background** | `#FAFAFA` | Page body, canvas workspace background |
| **Primary Text** | `#161616` | Main headings ($H_1, H_2, H_3$), prominent titles |
| **Secondary Text** | `#303030` | Body prose, descriptive paragraphs, secondary labels |
| **Muted Text** | `#8F8F8F` | Micro-labels, timestamps, metadata keys |
| **Secondary Surface** | `#F0F0F0` | Pill badge backgrounds, input field backgrounds |
| **Elevated Surface** | `#D9D9D9` | Dividers, edge paths, inactive handles |
| **Dark Surface** | `#212121` | Dark card sections, sidebar navigation, terminal views |
| **Primary Highlight** | `#FFBCCA` | Primary CTA buttons, brand badges, active pills |
| **Highlight Accent** | `#FF91AC` | Selected node borders, canvas connection handles, hover states |
| **White** | `#FFFFFF` | Node cards, modals, content panels |

### Component Design Specifications
- **Buttons**: Monospace font (`font-mono uppercase tracking-wider text-xs md:text-sm`), `rounded-full` (9999px pill radius). Primary: `#FFBCCA` surface with `#212121` text; Secondary: `#FFFFFF` surface with `#D9D9D9` border.
- **Cards**: `rounded-[24px]` radius, `#E5E5E5` micro-border, layered soft shadows.
- **Node Containers**: `rounded-[20px]` / `rounded-[24px]`, `#FFFFFF` surface, selected ring `border-[#FF91AC] ring-2 ring-[#FFBCCA]/50`.
- **Canvas Handles**: `10px` circular connectors, `#FFFFFF` interior, `#FF91AC` border, glowing hover scale.

---

## Application Route Map

- **`/` — Home Page**: Permanent product entry point featuring the headline *"Build AI agents. Visually."*, connected 6-node DAG preview, feature deep-dives, model provider flexibility, tool/memory explanations, and direct CTAs.
- **`/dashboard` — Application Dashboard**: Manage active agent workflows, view live pipeline statistics, filter by status, and navigate projects.
- **`/editor` & `/editor/:id` — Workflow Canvas Editor**: React Flow visual programming canvas, 9 custom node types, live node inspector drawer, and execution tracing.
- **`/projects` — Projects Workspace**: Group and organize related pipelines by workspace and product area.
- **`/templates` — Workflow Gallery**: Cloned starter templates for Autonomous Agents, RAG Pipelines, Chatbots, and API Automation.
- **`/providers` — Model Providers & Local LLMs**: Manage Ollama connection endpoints, discovered models, and server-side Gemini cloud keys.
- **`/settings` — System Preferences**: Configure execution timeouts, backend URLs, logging verbosity, and factory reset actions.
- **`/n8n` — Design Reference Showcase**: Exact measured reference layout and media embeds.

---

## Running the Automated Test Suite

```bash
cd backend
.venv\Scripts\pytest -v tests
```

Output:
```
============================= 24 passed in 14.75s =============================
```

## Running the Development Servers

```bash
# Frontend (Port 5173)
cd frontend
npm run dev

# Backend (Port 8000)
cd backend
python app/main.py
```
