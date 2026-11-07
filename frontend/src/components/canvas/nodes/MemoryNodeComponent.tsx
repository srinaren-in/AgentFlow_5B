import React from 'react'
import { NodeProps } from '@xyflow/react'
import { Database } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, MemoryNodeConfig } from '@/types'

export const MemoryNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as MemoryNodeConfig

  const memType = config.memoryType || 'buffer'
  const windowSize = config.windowSize || 10

  return (
    <BaseNode
      selected={selected}
      title={nodeData.label || 'Agent Memory'}
      subtitle={`Type: ${memType}`}
      icon={Database}
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      badge={`K=${windowSize}`}
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={[{ id: 'message', label: 'store' }]}
      outputs={[{ id: 'history', label: 'history' }]}
    >
      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
        <span>Session Retention</span>
        <span className="font-mono text-teal-700 font-semibold">{windowSize} turns</span>
      </div>
    </BaseNode>
  )
}
