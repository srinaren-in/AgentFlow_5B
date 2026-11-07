import { WorkflowDefinition } from '@/types'

const API_BASE = 'http://localhost:8000/api'

export interface IntermediateStep {
  step: number
  action: string
  args: Record<string, any>
  observation: any
  duration_ms?: number
}

export interface NodeExecutionState {
  node_id: string
  node_type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  inputs: Record<string, any>
  outputs: Record<string, any>
  error?: string
  duration_ms?: number
  intermediate_steps?: IntermediateStep[]
}

export interface ExecutionLogEntry {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
  node_id?: string
}

export interface ExecutionResponse {
  execution_id: string
  workflow_id: string
  status: 'completed' | 'failed' | 'running'
  result: Record<string, any>
  node_states: Record<string, NodeExecutionState>
  logs: ExecutionLogEntry[]
  error?: string
  start_time: string
  end_time?: string
  duration_ms?: number
}

export interface ValidationResponse {
  is_valid: boolean
  errors: string[]
  warnings: string[]
  execution_order: string[]
  entry_nodes: string[]
  exit_nodes: string[]
}

export const apiService = {
  async checkHealth(): Promise<{ status: string; engine: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) })
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  },

  async validateWorkflow(workflow: WorkflowDefinition): Promise<ValidationResponse> {
    const res = await fetch(`${API_BASE}/workflows/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Validation failed')
    }
    return await res.json()
  },

  async executeWorkflow(
    workflow: WorkflowDefinition,
    inputs: Record<string, any> = {},
    timeoutSeconds: number = 60
  ): Promise<ExecutionResponse> {
    const res = await fetch(`${API_BASE}/workflows/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workflow,
        inputs,
        timeout_seconds: timeoutSeconds,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || `Server returned error status ${res.status}`)
    }

    return await res.json()
  },

  async listTools(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/tools`)
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  },

  async getProvidersStatus(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/providers/status`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  },

  async getSessionMemory(sessionId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/memory/${sessionId}`)
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  },
}
