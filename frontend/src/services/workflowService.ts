import { Workflow, Project, ModelProvider, Template, WorkflowDefinition, AgentFlowNode } from '@/types'
import { Edge, MarkerType } from '@xyflow/react'

const STORAGE_KEYS = {
  WORKFLOWS: 'agentflow_workflows',
  PROJECTS: 'agentflow_projects',
  PROVIDERS: 'agentflow_providers',
  FLOW_PREFIX: 'agentflow_flow_',
}

export function createDefaultFlow(id: string, name: string): WorkflowDefinition {
  const inputNodeId = 'input_1'
  const promptNodeId = 'prompt_1'
  const llmNodeId = 'llm_1'
  const outputNodeId = 'output_1'

  const nodes: AgentFlowNode[] = [
    {
      id: inputNodeId,
      type: 'inputNode',
      position: { x: 100, y: 180 },
      data: {
        label: 'User Query',
        nodeType: 'inputNode',
        description: 'Accepts raw text query from the user.',
        isValid: true,
        config: {
          variableName: 'query',
          inputType: 'text',
          defaultValue: 'Explain topological sorting in AI pipeline orchestration.',
          required: true,
        },
      },
    },
    {
      id: promptNodeId,
      type: 'promptTemplateNode',
      position: { x: 420, y: 160 },
      data: {
        label: 'Instruction Prompt',
        nodeType: 'promptTemplateNode',
        description: 'Formats inputs into structured LLM instructions.',
        isValid: true,
        config: {
          template: 'You are a Senior Systems Architect.\n\nExplain {query} with clear engineering examples.',
          inputVariables: ['query'],
        },
      },
    },
    {
      id: llmNodeId,
      type: 'llmNode',
      position: { x: 760, y: 150 },
      data: {
        label: 'Qwen 2.5 / Gemini',
        nodeType: 'llmNode',
        description: 'Executes reasoning query using configured model adapter.',
        isValid: true,
        config: {
          provider: 'ollama',
          model: 'qwen2.5:7b',
          temperature: 0.7,
          maxTokens: 2048,
          systemPrompt: 'You are a technical mentor and full-stack software engineer.',
        },
      },
    },
    {
      id: outputNodeId,
      type: 'outputNode',
      position: { x: 1100, y: 180 },
      data: {
        label: 'Client Response',
        nodeType: 'outputNode',
        description: 'Renders the final formatted answer.',
        isValid: true,
        config: {
          outputFormat: 'markdown',
          responseKey: 'answer',
        },
      },
    },
  ]

  const edges: Edge[] = [
    {
      id: 'e_input_prompt',
      source: inputNodeId,
      target: promptNodeId,
      sourceHandle: 'output',
      targetHandle: 'var_query',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4f46e5' },
      style: { stroke: '#4f46e5', strokeWidth: 2 },
    },
    {
      id: 'e_prompt_llm',
      source: promptNodeId,
      target: llmNodeId,
      sourceHandle: 'formatted_prompt',
      targetHandle: 'prompt',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4f46e5' },
      style: { stroke: '#4f46e5', strokeWidth: 2 },
    },
    {
      id: 'e_llm_output',
      source: llmNodeId,
      target: outputNodeId,
      sourceHandle: 'response',
      targetHandle: 'input',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4f46e5' },
      style: { stroke: '#4f46e5', strokeWidth: 2 },
    },
  ]

  return {
    id,
    name,
    description: 'Production visual agent pipeline',
    version: '1.0.0',
    status: 'draft',
    nodes,
    edges,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['Default Pipeline', 'Qwen 2.5'],
    },
  }
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Customer Intelligence',
    description: 'Autonomous research and customer sentiment analysis workflows',
    workflowCount: 2,
    color: '#4f46e5',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'proj-2',
    name: 'API Integrations',
    description: 'Tool calling pipelines connecting internal services and webhooks',
    workflowCount: 1,
    color: '#0891b2',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const DEFAULT_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Research & Summarize Agent',
    description: 'Extracts web topics, queries local Ollama Qwen 2.5, and generates structured reports.',
    status: 'active',
    nodeCount: 4,
    edgeCount: 3,
    projectId: 'proj-1',
    projectName: 'Customer Intelligence',
    tags: ['Ollama', 'Summarization', 'LangGraph'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'wf-2',
    name: 'Multi-turn Gemini Reasoning Pipeline',
    description: 'Sequential reasoning chain utilizing Google Gemini 1.5/2.0 API with structured output schema.',
    status: 'draft',
    nodeCount: 4,
    edgeCount: 3,
    projectId: 'proj-1',
    projectName: 'Customer Intelligence',
    tags: ['Gemini', 'Chain-of-Thought'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'wf-3',
    name: 'Webhook Event Dispatcher & Validator',
    description: 'Validates incoming JSON payloads and conditionally routes to HTTP webhook endpoints.',
    status: 'draft',
    nodeCount: 4,
    edgeCount: 3,
    projectId: 'proj-2',
    projectName: 'API Integrations',
    tags: ['HTTP Tool', 'Conditional'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
]

const DEFAULT_PROVIDERS: ModelProvider[] = [
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    type: 'local',
    models: ['qwen2.5:7b', 'llama3.2:3b', 'mistral:7b', 'deepseek-r1:8b'],
    defaultModel: 'qwen2.5:7b',
    isConfigured: true,
    description: 'Local LLM runtime running on your private machine via localhost:11434 with zero data leakage.',
    endpoint: 'http://localhost:11434',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    type: 'cloud',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.0-flash',
    isConfigured: false,
    description: 'High-speed multimodal reasoning models powered by Google AI Cloud.',
  },
]

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'tpl-1',
    name: 'Standard LLM Question-Answering Pipeline',
    description: 'Simple 4-node pipeline: User Input → Prompt Template → LLM → Output Display.',
    category: 'Chatbot',
    nodesCount: 4,
    difficulty: 'Beginner',
    tags: ['Prompting', 'Single-turn'],
  },
  {
    id: 'tpl-2',
    name: 'Autonomous Research & Synthesis',
    description: 'Fetches content, filters relevant sections, and executes deep summary with Qwen 2.5.',
    category: 'Autonomous Agent',
    nodesCount: 5,
    difficulty: 'Intermediate',
    tags: ['Research', 'Ollama'],
  },
  {
    id: 'tpl-3',
    name: 'Conditional Webhook & Tool Execution',
    description: 'Evaluates user parameters, branches dynamically, and invokes custom HTTP endpoints.',
    category: 'API Automation',
    nodesCount: 5,
    difficulty: 'Intermediate',
    tags: ['HTTP Tool', 'Router'],
  },
]

export const workflowService = {
  getWorkflows(): Workflow[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKFLOWS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(DEFAULT_WORKFLOWS))
      return DEFAULT_WORKFLOWS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return DEFAULT_WORKFLOWS
    }
  },

  getWorkflowById(id: string): Workflow | undefined {
    const workflows = this.getWorkflows()
    return workflows.find((w) => w.id === id)
  },

  getWorkflowDefinition(id: string, defaultName = 'Untitled Workflow'): WorkflowDefinition {
    const raw = localStorage.getItem(`${STORAGE_KEYS.FLOW_PREFIX}${id}`)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        // Fallback below
      }
    }
    const def = createDefaultFlow(id, defaultName)
    this.saveWorkflowDefinition(id, def)
    return def
  },

  saveWorkflowDefinition(id: string, definition: WorkflowDefinition): void {
    localStorage.setItem(`${STORAGE_KEYS.FLOW_PREFIX}${id}`, JSON.stringify(definition))

    // Also sync nodeCount and edgeCount to the workflow summary list
    const workflows = this.getWorkflows()
    const updated = workflows.map((w) => {
      if (w.id === id) {
        return {
          ...w,
          nodeCount: definition.nodes?.length || 0,
          edgeCount: definition.edges?.length || 0,
          updatedAt: new Date().toISOString(),
        }
      }
      return w
    })
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(updated))
  },

  createWorkflow(payload: {
    name: string
    description: string
    projectId?: string
    tags?: string[]
  }): Workflow {
    const workflows = this.getWorkflows()
    const projects = this.getProjects()
    const project = projects.find((p) => p.id === payload.projectId)

    const id = `wf-${Date.now()}`
    const initialFlow = createDefaultFlow(id, payload.name.trim())

    const newWorkflow: Workflow = {
      id,
      name: payload.name.trim(),
      description: payload.description.trim(),
      status: 'draft',
      nodeCount: initialFlow.nodes.length,
      edgeCount: initialFlow.edges.length,
      projectId: payload.projectId,
      projectName: project ? project.name : undefined,
      tags: payload.tags || ['Custom'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.saveWorkflowDefinition(id, initialFlow)

    const updated = [newWorkflow, ...workflows]
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(updated))
    return newWorkflow
  },

  deleteWorkflow(id: string): void {
    const workflows = this.getWorkflows()
    const filtered = workflows.filter((w) => w.id !== id)
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(filtered))
    localStorage.removeItem(`${STORAGE_KEYS.FLOW_PREFIX}${id}`)
  },

  getProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS))
      return DEFAULT_PROJECTS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return DEFAULT_PROJECTS
    }
  },

  createProject(payload: { name: string; description: string; color?: string }): Project {
    const projects = this.getProjects()
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: payload.name.trim(),
      description: payload.description.trim(),
      workflowCount: 0,
      color: payload.color || '#4f46e5',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = [newProject, ...projects]
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated))
    return newProject
  },

  getModelProviders(): ModelProvider[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROVIDERS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(DEFAULT_PROVIDERS))
      return DEFAULT_PROVIDERS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return DEFAULT_PROVIDERS
    }
  },

  updateModelProvider(id: string, updates: Partial<ModelProvider>): ModelProvider[] {
    const providers = this.getModelProviders()
    const updated = providers.map((p) => (p.id === id ? { ...p, ...updates } : p))
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(updated))
    return updated
  },

  getTemplates(): Template[] {
    return DEFAULT_TEMPLATES
  },
}
