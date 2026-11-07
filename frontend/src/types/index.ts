import { Node, Edge, Viewport } from '@xyflow/react'

export type WorkflowStatus = 'draft' | 'active' | 'running' | 'error' | 'archived'

export type CustomNodeType =
  | 'inputNode'
  | 'outputNode'
  | 'llmNode'
  | 'promptTemplateNode'
  | 'conditionalNode'
  | 'pythonToolNode'
  | 'httpRequestNode'
  | 'memoryNode'
  | 'agentNode'

export interface BaseNodeConfig {
  [key: string]: any
}

export interface InputNodeConfig extends BaseNodeConfig {
  variableName: string
  inputType: 'text' | 'json' | 'chat_message'
  defaultValue: string
  required: boolean
}

export interface OutputNodeConfig extends BaseNodeConfig {
  outputFormat: 'text' | 'json' | 'markdown'
  responseKey: string
}

export interface LLMNodeConfig extends BaseNodeConfig {
  provider: 'ollama' | 'gemini'
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
}

export interface PromptTemplateNodeConfig extends BaseNodeConfig {
  template: string
  inputVariables: string[]
}

export interface ConditionalNodeConfig extends BaseNodeConfig {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty'
  value: string
}

export interface PythonToolNodeConfig extends BaseNodeConfig {
  functionName: string
  code: string
  timeoutSeconds: number
}

export interface HTTPRequestNodeConfig extends BaseNodeConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers: string
  bodyTemplate: string
}

export interface MemoryNodeConfig extends BaseNodeConfig {
  memoryType: 'buffer' | 'summary' | 'window'
  windowSize: number
  persistKey: string
}

export interface AgentNodeConfig extends BaseNodeConfig {
  role: string
  goal: string
  maxIterations: number
  model: string
  allowDelegation: boolean
}

export interface CustomNodeData {
  label: string
  nodeType: CustomNodeType
  description?: string
  isValid?: boolean
  validationError?: string
  config: Record<string, any>
  [key: string]: any
}

export type AgentFlowNode = Node<CustomNodeData>

export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  version: string
  status: WorkflowStatus
  nodes: AgentFlowNode[]
  edges: Edge[]
  viewport?: Viewport
  metadata: {
    createdAt: string
    updatedAt: string
    tags?: string[]
    projectId?: string
  }
}

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  nodeCount: number
  edgeCount: number
  projectId?: string
  projectName?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  flowData?: WorkflowDefinition
}

export interface Project {
  id: string
  name: string
  description: string
  workflowCount: number
  color: string
  createdAt: string
  updatedAt: string
}

export interface ModelProvider {
  id: string
  name: string
  type: 'local' | 'cloud'
  models: string[]
  defaultModel: string
  isConfigured: boolean
  description: string
  endpoint?: string
}

export interface Template {
  id: string
  name: string
  description: string
  category: 'Autonomous Agent' | 'RAG Pipeline' | 'Chatbot' | 'API Automation' | 'Data Extraction'
  nodesCount: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  tags: string[]
  flowData?: WorkflowDefinition
}
