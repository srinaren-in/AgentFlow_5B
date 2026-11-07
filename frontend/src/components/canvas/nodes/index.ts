import { NodeTypes } from '@xyflow/react'
import { InputNodeComponent } from './InputNodeComponent'
import { OutputNodeComponent } from './OutputNodeComponent'
import { LLMNodeComponent } from './LLMNodeComponent'
import { PromptTemplateNodeComponent } from './PromptTemplateNodeComponent'
import { ConditionalNodeComponent } from './ConditionalNodeComponent'
import { PythonToolNodeComponent } from './PythonToolNodeComponent'
import { HTTPRequestNodeComponent } from './HTTPRequestNodeComponent'
import { MemoryNodeComponent } from './MemoryNodeComponent'
import { AgentNodeComponent } from './AgentNodeComponent'

export const nodeTypes: NodeTypes = {
  inputNode: InputNodeComponent,
  outputNode: OutputNodeComponent,
  llmNode: LLMNodeComponent,
  promptTemplateNode: PromptTemplateNodeComponent,
  conditionalNode: ConditionalNodeComponent,
  pythonToolNode: PythonToolNodeComponent,
  httpRequestNode: HTTPRequestNodeComponent,
  memoryNode: MemoryNodeComponent,
  agentNode: AgentNodeComponent,
}

export {
  InputNodeComponent,
  OutputNodeComponent,
  LLMNodeComponent,
  PromptTemplateNodeComponent,
  ConditionalNodeComponent,
  PythonToolNodeComponent,
  HTTPRequestNodeComponent,
  MemoryNodeComponent,
  AgentNodeComponent,
}

