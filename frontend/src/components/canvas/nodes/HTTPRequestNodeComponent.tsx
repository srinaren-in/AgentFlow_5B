import React from 'react'
import { NodeProps } from '@xyflow/react'
import { Globe } from 'lucide-react'
import { BaseNode } from '../BaseNode'
import { CustomNodeData, HTTPRequestNodeConfig } from '@/types'

export const HTTPRequestNodeComponent: React.FC<NodeProps> = ({ id: _id, data, selected }) => {
  const nodeData = data as unknown as CustomNodeData
  const config = (nodeData.config || {}) as HTTPRequestNodeConfig

  const method = config.method || 'GET'
  const url = config.url || 'https://api.example.com/data'

  const methodColors: Record<string, string> = {
    GET: 'bg-sky-100 text-sky-700 border-sky-200',
    POST: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PUT: 'bg-amber-100 text-amber-700 border-amber-200',
    DELETE: 'bg-rose-100 text-rose-700 border-rose-200',
  }

  return (
    <BaseNode
      selected={selected}
      title={nodeData.label || 'HTTP Request'}
      subtitle={url}
      icon={Globe}
      iconColor="text-blue-600"
      iconBg="bg-blue-50"
      badge={method}
      isValid={nodeData.isValid}
      validationMessage={nodeData.validationError}
      inputs={[{ id: 'payload', label: 'body' }]}
      outputs={[{ id: 'response', label: 'data' }]}
    >
      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100 text-[11px]">
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
            methodColors[method] || 'bg-slate-100 text-slate-700'
          }`}
        >
          {method}
        </span>
        <span className="font-mono text-slate-600 truncate">{url}</span>
      </div>
    </BaseNode>
  )
}

