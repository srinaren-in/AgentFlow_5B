# AgentFlow

> Production-Oriented Visual AI Agent Builder & Cognitive Pipeline Orchestrator

AgentFlow is an extensible visual platform for designing, running, and observing complex AI agent pipelines. It bridges an intuitive drag-and-drop workflow canvas with production-grade orchestration powered by **FastAPI**, **LangGraph ReAct loops**, **4-Role Cognitive Flow Architecture (Planner → Executor → Verifier → Generator)**, **Ollama (local LLMs & Qwen 2.5)**, **Google Gemini (cloud multimodal LLMs)**, and **PostgreSQL**.

---

## Architecture Overview

```
AgentFlow/
├── frontend/               # React 19 + TypeScript + Vite + Tailwind CSS v4 + @xyflow/react
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/     # Core design system components (Button, Badge, Card, Modal, Input)
│   │   │   ├── dashboard/  # Dashboard & Project cards, forms, and live metrics
│   │   │   └── canvas/     # @xyflow/react Canvas, 9 Custom Nodes, Config Inspector, Execution Drawer
│   │   ├── layouts/        # AppLayout, collapsible Sidebar, TopNav
│   │   ├── pages/          # Dashboard, Editor, Projects, Templates, Providers, Settings
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

## Cognitive Agent Architectures

AgentFlow supports two distinct agent orchestration paradigms:

### 1. 4-Role Flow Architecture (Inspired by `lupantech/AgentFlow`)
Deconstructs multi-turn agentic reasoning into four collaborative roles:
- **🧭 Planner**: Analyzes goal decomposition, reviews memory and verification critique, and selects concrete actions.
- **🛠 Executor**: Safely invokes registered tools (Calculator, Wikipedia Search, Python Sandbox, HTTP API).
- **✓ Verifier**: Critically evaluates intermediate observations against sub-goals to validate if step succeeded or requires revision.
- **✍️ Generator**: Synthesizes the final verified response citing validated evidence and step rationale.

### 2. LangGraph ReAct Single-Loop
Standard single-model ReAct pattern (`agent -> should_continue -> tools -> agent`) for deterministic tasks and lightweight execution.

---

## Completed Milestones

- [x] **Milestone 01: Foundation & Application Shell**: Professional developer-tool interface, collapsible sidebar navigation, top navigation, design tokens, dashboard with live metrics, and routed pages (Dashboard, Projects, Templates, Model Providers, Settings).
- [x] **Milestone 02: Visual Workflow Builder & Node Architecture**: Custom `@xyflow/react` canvas, 9 custom node types (`InputNode`, `OutputNode`, `LLMNode`, `PromptTemplateNode`, `ConditionalNode`, `PythonToolNode`, `HTTPRequestNode`, `MemoryNode`, `AgentNode`), inspector config drawer, DAG validation, and JSON export/import.
- [x] **Milestone 03: FastAPI Backend & Workflow Engine**: Modular backend architecture, Kahn's topological sort, cycle detection, input/output handle routing, conditional branch execution, and real-time execution drawer with timing and per-node logs.
- [x] **Milestone 04: AI Agent Intelligence & LangGraph**: LangGraph ReAct reasoning cycle, modular tool registry, Subprocess Python Sandbox with 8s timeout, AST Calculator, and database-backed conversation memory.
- [x] **Milestone 05: Persistence, Security, Testing & Production Deployment**:
  - **Database Persistence & Migrations**: SQLAlchemy models for Users, Projects, Workflows, Executions, and Memory Sessions, configured with Alembic migrations (`alembic upgrade head`).
  - **Authentication & Authorization**: Password hashing via direct `bcrypt`, JWT access tokens, and protected API routes (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
  - **Security Audits & Hardening**: SSRF guard blocking RFC 1918 private ranges, AWS/cloud metadata (`169.254.169.254`), and loopback addresses; process isolation for user Python code execution.
  - **Automated Test Suite**: 24 comprehensive automated pytest tests covering agent loop, Flow-4Role solver, tool sandboxing, DAG cycle detection, API endpoints, JWT auth, and SSRF security.
  - **Production Deployment**: Optimized multi-stage Docker builds (`node:20-alpine` + `nginx:alpine` frontend, `python:3.12-slim` backend) orchestrated via `docker-compose.yml` with `postgres:16-alpine`.
- [x] **4-Role Cognitive Engine**: Built `FlowSolver` (Planner, Executor, Verifier, Generator), `WikipediaSearchTool`, and integrated cognitive architecture selection into the visual canvas.

---

## Quickstart

### Option 1: Docker Compose (Production Environment)

Run the entire stack (PostgreSQL 16, FastAPI Backend, and React Frontend) with a single command:

```bash
# 1. Clone repository and navigate into the folder
cd AgentFlow

# 2. Configure environment variables
cp .env.example .env

# 3. Start containers
docker compose up --build -d
```

- **Frontend Application**: `http://localhost:80`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432`

---

### Option 2: Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Run automated tests
pytest -v tests

# Launch API server (port 8000)
python app/main.py
```

#### 2. Frontend Setup
```bash
cd frontend
npm install

# Build verification
npm run build

# Start Vite dev server (port 5173)
npm run dev
```

---

## Running the Automated Test Suite

```bash
cd backend
.venv\Scripts\pytest -v tests
```

Output:
```
tests/test_agent.py::test_agent_tool_execution_node PASSED               [  4%]
tests/test_agent.py::test_should_continue_logic PASSED                   [  8%]
tests/test_agent.py::test_build_agent_graph PASSED                       [ 12%]
tests/test_api.py::test_health_check_endpoint PASSED                     [ 16%]
tests/test_api.py::test_workflow_validation_endpoint PASSED              [ 20%]
tests/test_api.py::test_workflow_execution_endpoint PASSED               [ 25%]
tests/test_auth_and_security.py::test_auth_registration_and_login PASSED [ 29%]
tests/test_auth_and_security.py::test_ssrf_protection_blocks_private_and_metadata_targets PASSED [ 33%]
tests/test_auth_and_security.py::test_ssrf_protection_allows_valid_public_domain PASSED [ 37%]
tests/test_conditional.py::test_conditional_branching PASSED             [ 41%]
tests/test_engine.py::test_input_prompt_output_pipeline PASSED           [ 45%]
tests/test_flow_agent.py::test_wikipedia_tool_structure PASSED           [ 50%]
tests/test_flow_agent.py::test_executor_role_calculator PASSED           [ 54%]
tests/test_flow_agent.py::test_verifier_role_evaluation PASSED           [ 58%]
tests/test_flow_agent.py::test_flow_solver_execution PASSED              [ 62%]
tests/test_memory.py::test_persistent_memory_session PASSED              [ 66%]
tests/test_tools.py::test_calculator_tool_valid PASSED                   [ 70%]
tests/test_tools.py::test_calculator_tool_sqrt PASSED                    [ 75%]
tests/test_tools.py::test_calculator_tool_invalid PASSED                 [ 79%]
tests/test_tools.py::test_python_sandbox_tool PASSED                     [ 83%]
tests/test_tools.py::test_tool_registry PASSED                           [ 87%]
tests/test_validation.py::test_valid_dag_workflow PASSED                 [ 91%]
tests/test_validation.py::test_cycle_detection PASSED                    [ 95%]
tests/test_validation.py::test_self_loop PASSED                          [100%]

============================= 24 passed in 13.28s =============================
```
