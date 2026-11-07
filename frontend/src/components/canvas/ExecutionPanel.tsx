import React, { useState } from 'react'
import { ExecutionResponse } from '@/services/api'
import { Badge } from '@/components/common/Badge'
import { XCircle, Clock, ChevronDown, ChevronRight, Terminal, Layers } from 'lucide-react'

interface ExecutionPanelProps {
  execution: ExecutionResponse | null
  isRunning: boolean
}

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({ execution, isRunning }) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }))
  }

  if (isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
        <h4 className="text-xs font-semibold text-slate-800">Pipeline Executing...</h4>
        <p className="text-[11px] text-slate-400 mt-1">
          FastAPI DAG engine is evaluating node dependencies and streaming state.
        </p>
      </div>
    )
  }

  if (!execution) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <Terminal className="w-8 h-8 mb-2 text-slate-300" />
        <p className="text-xs font-medium text-slate-600">No active execution</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
          Click "Run Pipeline" to execute the DAG engine and monitor node states in real time.
        </p>
      </div>
    )
  }

  const isSuccess = execution.status === 'completed'
  const nodeStateEntries = Object.entries(execution.node_states || {})

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-xs">
      {/* Execution Summary Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
            <span className="font-semibold text-slate-900">ID:</span>
            <span>{execution.execution_id}</span>
          </div>
          <Badge variant={isSuccess ? 'success' : 'danger'} dot>
            {execution.status.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {execution.duration_ms ? `${execution.duration_ms.toFixed(1)}ms` : '0ms'}
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {nodeStateEntries.length} Nodes
          </span>
        </div>

        {execution.error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded text-[11px] flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-semibold">Pipeline Execution Failed:</span>
              <p className="mt-0.5 font-mono text-[10px] break-all">{execution.error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Final Result Card */}
        {execution.result && Object.keys(execution.result).length > 0 && (
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
              Final Pipeline Output
            </span>
            <div className="p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-xs">
              {typeof execution.result.final_output === 'string'
                ? execution.result.final_output
                : JSON.stringify(execution.result, null, 2)}
            </div>
          </div>
        )}

        {/* Node-by-Node Execution States */}
        <div className="space-y-2">
          <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
            Node State Breakdown ({nodeStateEntries.length})
          </span>

          <div className="space-y-1.5">
            {nodeStateEntries.map(([nodeId, state]) => {
              const isExpanded = !!expandedNodes[nodeId]
              const nodeSuccess = state.status === 'completed'
              const nodeSkipped = state.status === 'skipped'
              const nodeFailed = state.status === 'failed'

              return (
                <div
                  key={nodeId}
                  className="border border-slate-200 rounded-md bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleNodeExpand(nodeId)}
                    className="w-full px-2.5 py-1.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span className="font-semibold text-slate-800 truncate">{nodeId}</span>
                      <span className="text-[10px] font-mono text-slate-400">({state.node_type})</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {state.duration_ms !== undefined && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {state.duration_ms.toFixed(0)}ms
                        </span>
                      )}
                      <Badge
                        variant={
                          nodeSuccess ? 'success' : nodeSkipped ? 'neutral' : nodeFailed ? 'danger' : 'info'
                        }
                      >
                        {state.status}
                      </Badge>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 space-y-2 text-[11px]">
                      {state.inputs && Object.keys(state.inputs).length > 0 && (
                        <div>
                          <span className="font-medium text-slate-600 block mb-0.5">Inputs:</span>
                          <pre className="p-1.5 bg-white border border-slate-200 rounded text-[10px] font-mono overflow-x-auto">
                            {JSON.stringify(state.inputs, null, 2)}
                          </pre>
                        </div>
                      )}
                      {state.outputs && Object.keys(state.outputs).length > 0 && (
                        <div>
                          <span className="font-medium text-slate-600 block mb-0.5">Outputs:</span>
                          <pre className="p-1.5 bg-white border border-slate-200 rounded text-[10px] font-mono overflow-x-auto text-emerald-700">
                            {JSON.stringify(state.outputs, null, 2)}
                          </pre>
                        </div>
                      )}
                      {state.error && (
                        <div className="text-rose-600 font-mono text-[10px] bg-rose-50 p-1.5 rounded border border-rose-200">
                          Error: {state.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Structured Execution Logs */}
        <div className="space-y-1.5">
          <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] flex items-center justify-between">
            <span>Execution Logs ({execution.logs?.length || 0})</span>
            <span className="text-[10px] text-slate-400 font-mono">Stream</span>
          </span>

          <div className="p-2.5 bg-slate-900 rounded-lg text-slate-300 font-mono text-[11px] space-y-1 max-h-56 overflow-y-auto">
            {execution.logs && execution.logs.length > 0 ? (
              execution.logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1.5 leading-tight">
                  <span className="text-slate-500 shrink-0">
                    {log.timestamp ? log.timestamp.slice(11, 19) : ''}
                  </span>
                  <span
                    className={
                      log.level === 'ERROR'
                        ? 'text-rose-400 font-bold'
                        : log.level === 'WARN'
                        ? 'text-amber-400'
                        : 'text-indigo-400'
                    }
                  >
                    [{log.level}]
                  </span>
                  {log.node_id && (
                    <span className="text-slate-400 shrink-0">[{log.node_id}]:</span>
                  )}
                  <span className="text-slate-200 break-words">{log.message}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No logs recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
