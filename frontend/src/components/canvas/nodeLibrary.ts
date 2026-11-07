import { LucideIcon, LogIn, LogOut, Cpu, FileText, Split, Code2, Globe, Database, Bot } from 'lucide-react'
import { CustomNodeType, AgentFlowNode } from '@/types'
import { Connection, Edge } from '@xyflow/react'

export interface NodeTemplate {
  type: CustomNodeType
  label: string
  category: 'I/O' | 'Models' | 'Prompting' | 'Logic' | 'Tools' | 'Memory' | 'Agents'
  description: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  defaultConfig: Record<string, any>
}

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: 'inputNode',
    label: 'User Input',
    category: 'I/O',
    description: 'Entry point accepting raw text, JSON payload, or chat message from caller.',
    icon: LogIn,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50',
    defaultConfig: {
      variableName: 'user_input',
      inputType: 'text',
      defaultValue: '',
      required: true,
    },
  },
  {
    type: 'promptTemplateNode',
    label: 'Prompt Template',
    category: 'Prompting',
    description: 'Formats variables into structured prompts using {variable} placeholders.',
    icon: FileText,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    defaultConfig: {
      template: 'Given the context: {context}\n\nAnswer the user query: {query}',
      inputVariables: ['context', 'query'],
    },
  },
  {
    type: 'llmNode',
    label: 'LLM Engine',
    category: 'Models',
    description: 'Executes reasoning query using local Ollama (Qwen 2.5) or Google Gemini.',
    icon: Cpu,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    defaultConfig: {
      provider: 'ollama',
      model: 'qwen2.5:7b',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: 'You are an accurate, helpful AI engineering assistant.',
    },
  },
  {
    type: 'conditionalNode',
    label: 'Conditional Logic',
    category: 'Logic',
    description: 'Evaluates payload conditions and dynamically branches pipeline flow.',
    icon: Split,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    defaultConfig: {
      field: 'input',
      operator: 'contains',
      value: 'urgent',
    },
  },
  {
    type: 'pythonToolNode',
    label: 'Python Tool',
    category: 'Tools',
    description: 'Executes a sandboxed Python transformation or data processing function.',
    icon: Code2,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    defaultConfig: {
      functionName: 'transform_data',
      code: 'def transform_data(args):\n    # Extract and clean input text\n    raw = args.get("text", "")\n    return {"cleaned": raw.strip(), "length": len(raw)}',
      timeoutSeconds: 10,
    },
  },
  {
    type: 'httpRequestNode',
    label: 'HTTP Request',
    category: 'Tools',
    description: 'Dispatches external REST API requests or triggers webhooks with custom headers.',
    icon: Globe,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    defaultConfig: {
      method: 'POST',
      url: 'https://api.example.com/webhook',
      headers: '{\n  "Content-Type": "application/json"\n}',
      bodyTemplate: '{\n  "data": "{{input}}"\n}',
    },
  },
  {
    type: 'memoryNode',
    label: 'Memory Buffer',
    category: 'Memory',
    description: 'Maintains stateful conversation history and context window buffer across turns.',
    icon: Database,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    defaultConfig: {
      memoryType: 'window',
      windowSize: 10,
      persistKey: 'session_chat_history',
    },
  },
  {
    type: 'agentNode',
    label: 'Autonomous Agent',
    category: 'Agents',
    description: '4-Role cognitive agent (Planner -> Executor -> Verifier -> Generator) or ReAct loop.',
    icon: Bot,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    defaultConfig: {
      role: 'Autonomous Researcher',
      goal: 'Investigate user query, run tools, and summarize conclusion.',
      maxIterations: 5,
      model: 'gemini-2.0-flash',
      allowDelegation: false,
      architecture: 'flow',
      toolsEnabled: ['calculator', 'wikipedia_search', 'http_request', 'python_interpreter'],
    },
  },
  {
    type: 'outputNode',
    label: 'Output Node',
    category: 'I/O',
    description: 'Terminal node that formats and delivers the final pipeline response.',
    icon: LogOut,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    defaultConfig: {
      outputFormat: 'markdown',
      responseKey: 'final_response',
    },
  },
]

let idCounter = 1

export function generateNodeId(type: CustomNodeType): string {
  const prefix = type.replace('Node', '')
  const timestamp = Date.now().toString(36).slice(-4)
  const count = idCounter++
  return `${prefix}_${timestamp}_${count}`
}

export function createNewNode(type: CustomNodeType, position = { x: 250, y: 150 }): AgentFlowNode {
  const template = NODE_TEMPLATES.find((t) => t.type === type)
  if (!template) {
    throw new Error(`Unknown node type: ${type}`)
  }

  const id = generateNodeId(type)

  return {
    id,
    type,
    position,
    data: {
      label: template.label,
      nodeType: type,
      description: template.description,
      isValid: true,
      config: JSON.parse(JSON.stringify(template.defaultConfig)),
    },
  }
}

/**
 * Validates whether a connection between two handles is legal.
 */
export function isValidConnection(
  connection: Connection,
  nodes: AgentFlowNode[],
  edges: Edge[]
): { isValid: boolean; message?: string } {
  // Prevent connecting to self
  if (connection.source === connection.target) {
    return { isValid: false, message: 'Cannot connect a node to itself.' }
  }

  // Prevent duplicate edges between identical source and target handles
  const isDuplicate = edges.some(
    (e) =>
      e.source === connection.source &&
      e.target === connection.target &&
      e.sourceHandle === connection.sourceHandle &&
      e.targetHandle === connection.targetHandle
  )

  if (isDuplicate) {
    return { isValid: false, message: 'This connection already exists.' }
  }

  // Validate that source and target nodes exist
  const sourceNode = nodes.find((n) => n.id === connection.source)
  const targetNode = nodes.find((n) => n.id === connection.target)

  if (!sourceNode || !targetNode) {
    return { isValid: false, message: 'Invalid source or target node.' }
  }

  return { isValid: true }
}

