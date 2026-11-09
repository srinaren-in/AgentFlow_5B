import React from 'react'
import { NodeProps } from '@xyflow/react'
import { LogIn } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, InputNodeConfig } from '@/types'

export const InputNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as InputNodeConfig

  const variableName = config.variableName || 'user_input'
  const inputType = config.inputType || 'text'

  return (
    <BaseNode
      executionStatus={nodeData.executionStatus}
      selected={selected}
      title={nodeData.label || 'User Input'}
      subtitle={`Var: {${variableName}}`}
      icon={LogIn}
      iconColor="text-sky-600"
      iconBg="bg-sky-50"
      badge={inputType}
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={[]}
      outputs={[{ id: 'output', label: 'value' }]}
    >
      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] text-slate-500 font-mono truncate">
        {config.defaultValue ? `default: "${config.defaultValue}"` : 'Awaiting input payload...'}
      </div>
    </BaseNode>
  )
}

