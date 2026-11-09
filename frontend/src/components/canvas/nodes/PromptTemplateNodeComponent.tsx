import React from 'react'
import { NodeProps } from '@xyflow/react'
import { FileText } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, PromptTemplateNodeConfig } from '@/types'

export const PromptTemplateNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as PromptTemplateNodeConfig

  const template = config.template || 'Answer the following query: {input}'
  const inputVariables = config.inputVariables || ['input']

  const inputs = inputVariables.map((v) => ({
    id: `var_${v}`,
    label: `{${v}}`,
  }))

  return (
    <BaseNode
      executionStatus={nodeData.executionStatus}
      selected={selected}
      title={nodeData.label || 'Prompt Template'}
      subtitle={`${inputVariables.length} variable${inputVariables.length === 1 ? '' : 's'}`}
      icon={FileText}
      iconColor="text-violet-600"
      iconBg="bg-violet-50"
      badge="TEMPLATE"
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={inputs.length > 0 ? inputs : [{ id: 'input', label: 'var' }]}
      outputs={[{ id: 'formatted_prompt', label: 'prompt' }]}
    >
      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] text-slate-600 font-mono line-clamp-2 italic">
        "{template}"
      </div>
    </BaseNode>
  )
}

