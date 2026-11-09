import React from 'react'
import { NodeProps } from '@xyflow/react'
import { Code2 } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, PythonToolNodeConfig } from '@/types'

export const PythonToolNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as PythonToolNodeConfig

  const fnName = config.functionName || 'transform_data'
  const timeout = config.timeoutSeconds || 10

  return (
    <BaseNode
      executionStatus={nodeData.executionStatus}
      selected={selected}
      title={nodeData.label || 'Python Tool'}
      subtitle={`def ${fnName}(args):`}
      icon={Code2}
      iconColor="text-emerald-600"
      iconBg="bg-emerald-50"
      badge="SANDBOX"
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={[{ id: 'args', label: 'args' }]}
      outputs={[{ id: 'result', label: 'result' }]}
    >
      <div className="bg-slate-900 text-emerald-400 p-2 rounded text-[10px] font-mono truncate">
        <code>{config.code ? config.code.split('\n')[0] : 'return {"status": "ok"}'}</code>
      </div>
      <div className="text-[10px] text-slate-400 text-right">Timeout: {timeout}s</div>
    </BaseNode>
  )
}

