import React from 'react'
import { NodeProps } from '@xyflow/react'
import { Cpu } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, LLMNodeConfig } from '@/types'

export const LLMNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as LLMNodeConfig

  const provider = config.provider || 'ollama'
  const model = config.model || (provider === 'ollama' ? 'qwen2.5:7b' : 'gemini-2.0-flash')
  const temp = typeof config.temperature === 'number' ? config.temperature : 0.7

  return (
    <BaseNode
      selected={selected}
      title={nodeData.label || 'LLM Engine'}
      subtitle={`${provider.toUpperCase()} • ${model}`}
      icon={Cpu}
      iconColor="text-indigo-600"
      iconBg="bg-indigo-50"
      badge={`T: ${temp}`}
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={[
        { id: 'prompt', label: 'prompt' },
        { id: 'system_prompt', label: 'system' },
      ]}
      outputs={[{ id: 'response', label: 'output' }]}
    >
      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
        <span>Max Tokens: {config.maxTokens || 2048}</span>
        <span className="font-mono text-indigo-600">{provider}</span>
      </div>
    </BaseNode>
  )
}

