import React from 'react'
import { NodeProps } from '@xyflow/react'
import { Bot } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, AgentNodeConfig } from '@/types'

export const AgentNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as AgentNodeConfig

  const role = config.role || 'Autonomous Researcher'
  const model = config.model || 'gemini-2.0-flash'
  const maxIters = config.maxIterations || 5

  return (
    <BaseNode
      selected={selected}
      title={nodeData.label || 'Autonomous Agent'}
      subtitle={`Role: ${role}`}
      icon={Bot}
      iconColor="text-rose-600"
      iconBg="bg-rose-50"
      badge={`MAX ${maxIters}`}
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={[
        { id: 'goal', label: 'goal' },
        { id: 'tools', label: 'tools' },
      ]}
      outputs={[
        { id: 'result', label: 'result' },
        { id: 'thought_steps', label: 'steps' },
      ]}
    >
      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] text-slate-600 space-y-1">
        <div className="flex items-center justify-between">
          <span>Engine Model:</span>
          <span className="font-mono text-rose-700 font-semibold">{model}</span>
        </div>
        <p className="text-[10px] text-slate-400 italic truncate">
          Goal: {config.goal || 'Synthesize research and format action plan'}
        </p>
      </div>
    </BaseNode>
  )
}
