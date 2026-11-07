export type WorkflowStatus = 'draft' | 'active' | 'running' | 'error' | 'archived'

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
}
