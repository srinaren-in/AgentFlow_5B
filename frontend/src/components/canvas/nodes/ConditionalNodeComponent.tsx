import React from 'react'
import { NodeProps } from '@xyflow/react'
import { Split } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, ConditionalNodeConfig } from '@/types'

export const ConditionalNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as ConditionalNodeConfig

  const field = config.field || 'input'
  const operator = config.operator || 'contains'
  const value = config.value || ''

  return (
    <BaseNode
      selected={selected}
      title={nodeData.label || 'Conditional Router'}
      subtitle={`If ${field} ${operator}`}
      icon={Split}
      iconColor="text-amber-600"
      iconBg="bg-amber-50"
      badge="BRANCH"
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={[{ id: 'input', label: 'eval' }]}
      outputs={[
        { id: 'true_branch', label: 'TRUE' },
        { id: 'false_branch', label: 'FALSE' },
      ]}
    >
      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] font-mono text-slate-700 flex items-center justify-between">
        <span className="text-amber-700">{operator}</span>
        <span className="truncate max-w-[120px] font-semibold">"{value || '...'}"</span>
      </div>
    </BaseNode>
  )
}
