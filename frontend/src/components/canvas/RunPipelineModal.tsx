import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input, Textarea } from '@/components/common/Input'
import { WorkflowDefinition } from '@/types'
import { Play, AlertCircle, CheckCircle2 } from 'lucide-react'
import { apiService } from '@/services/api'

interface RunPipelineModalProps {
  isOpen: boolean
  onClose: () => void
  workflow: WorkflowDefinition
  onExecute: (inputs: Record<string, any>) => void
  isRunning: boolean
}

export const RunPipelineModal: React.FC<RunPipelineModalProps> = ({
  isOpen,
  onClose,
  workflow,
  onExecute,
  isRunning,
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>({})
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)

  // Extract input nodes to populate fields
  const inputNodes = workflow.nodes.filter((n) => n.type === 'inputNode')

  useEffect(() => {
    const initial: Record<string, any> = {}
    inputNodes.forEach((node) => {
      const varName = node.data?.config?.variableName || 'user_input'
      const defaultVal = node.data?.config?.defaultValue || ''
      initial[varName] = defaultVal
    })
    setInputs(initial)

    // Check backend health
    apiService.checkHealth().then((health) => {
      setBackendOnline(health !== null)
    })
  }, [workflow])

  const handleInputChange = (varName: string, val: string) => {
    setInputs((prev) => ({
      ...prev,
      [varName]: val,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onExecute(inputs)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Run Visual AI Pipeline"
      description={`Executing graph: ${workflow.name} (${workflow.nodes.length} nodes, ${workflow.edges.length} edges)`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Backend Connectivity Status Alert */}
        {backendOnline === false && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">FastAPI Backend Offline</span>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Ensure the backend server is running on <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">http://localhost:8000</code>.
              </p>
            </div>
          </div>
        )}

        {backendOnline === true && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">FastAPI DAG Engine Connected</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              Port 8000
            </span>
          </div>
        )}

        {/* Input Variables Form */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Pipeline Runtime Parameters ({inputNodes.length})
          </label>

          {inputNodes.length === 0 ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500">
              No input nodes defined in this workflow. Running with empty payload.
            </div>
          ) : (
            inputNodes.map((node) => {
              const varName = node.data?.config?.variableName || 'user_input'
              const label = node.data?.label || varName
              const inputType = node.data?.config?.inputType || 'text'

              return (
                <div key={node.id} className="space-y-1">
                  {inputType === 'text' ? (
                    <Textarea
                      label={`${label} ({${varName}})`}
                      value={inputs[varName] ?? ''}
                      onChange={(e) => handleInputChange(varName, e.target.value)}
                      placeholder={`Enter test value for ${varName}...`}
                      rows={3}
                    />
                  ) : (
                    <Input
                      label={`${label} ({${varName}})`}
                      value={inputs[varName] ?? ''}
                      onChange={(e) => handleInputChange(varName, e.target.value)}
                      placeholder={`Enter value for ${varName}...`}
                    />
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Execution Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isRunning}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Execute Pipeline
          </Button>
        </div>
      </form>
    </Modal>
  )
}

