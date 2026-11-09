import React from 'react'
import { NodeProps } from '@xyflow/react'
import { LogOut } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, OutputNodeConfig } from '@/types'

export const OutputNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as OutputNodeConfig

  const format = config.outputFormat || 'text'
  const key = config.responseKey || 'result'

  return (
    <BaseNode
      executionStatus={nodeData.executionStatus}
      selected={selected}
      title={nodeData.label || 'Workflow Output'}
      subtitle={`Response key: ${key}`}
      icon={LogOut}
      iconColor="text-emerald-600"
      iconBg="bg-emerald-50"
      badge={format.toUpperCase()}
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={[{ id: 'input', label: 'result' }]}
      outputs={[]}
    >
      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] text-slate-500 font-mono">
        Renders final pipeline response
      </div>
    </BaseNode>
  )
}

