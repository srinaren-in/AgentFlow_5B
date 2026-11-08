import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Workflow, WorkflowDefinition } from '@/types'
import { workflowService } from '@/services/workflowService'
import { apiService, ExecutionResponse } from '@/services/api'
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas'
import { RunPipelineModal } from '@/components/canvas/RunPipelineModal'
import { NODE_TEMPLATES } from '@/components/canvas/nodeLibrary'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import {
  Play,
  ArrowLeft,
  Layers,
  Search,
  Sparkles,
  HelpCircle,
  Activity,
} from 'lucide-react'

export const WorkflowEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [flowDefinition, setFlowDefinition] = useState<WorkflowDefinition | null>(null)
  const [nodeSearch, setNodeSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [saveBanner, setSaveBanner] = useState(false)

  // Execution States
  const [isRunModalOpen, setIsRunModalOpen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [latestExecution, setLatestExecution] = useState<ExecutionResponse | null>(null)
  const [activeDrawerTab, setActiveDrawerTab] = useState<'config' | 'logs'>('config')
  const [backendStatus, setBackendStatus] = useState<string>('checking')

  useEffect(() => {
    const workflows = workflowService.getWorkflows()
    let current = workflows.find((w) => w.id === id)
    if (!current && workflows.length > 0) {
      current = workflows[0]
    }

    if (current) {
      setWorkflow(current)
      const def = workflowService.getWorkflowDefinition(current.id, current.name)
      setFlowDefinition(def)
    }

    // Ping backend engine health
    apiService.checkHealth().then((res) => {
      setBackendStatus(res ? 'online' : 'offline')
    })
  }, [id])

  const handleSaveFlow = (updatedDef: WorkflowDefinition) => {
    if (!workflow) return
    workflowService.saveWorkflowDefinition(workflow.id, updatedDef)
    setFlowDefinition(updatedDef)
    setSaveBanner(true)
    setTimeout(() => setSaveBanner(false), 2000)
  }

  const handleExecutePipeline = async (inputs: Record<string, any>) => {
    if (!flowDefinition) return

    setIsRunModalOpen(false)
    setIsRunning(true)
    setActiveDrawerTab('logs')

    try {
      const response = await apiService.executeWorkflow(flowDefinition, inputs)
      setLatestExecution(response)
    } catch (err: any) {
      setLatestExecution({
        execution_id: `err_${Date.now()}`,
        workflow_id: flowDefinition.id,
        status: 'failed',
        result: {},
        node_states: {},
        logs: [
          {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            message: `Execution failed to reach FastAPI backend: ${err.message || 'Network error'}`,
          },
        ],
        error: err.message || 'Backend execution failure',
        start_time: new Date().toISOString(),
      })
    } finally {
      setIsRunning(false)
    }
  }

  const filteredTemplates = NODE_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.label.toLowerCase().includes(nodeSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(nodeSearch.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', 'I/O', 'Models', 'Prompting', 'Logic', 'Tools', 'Memory', 'Agents']

  if (!workflow || !flowDefinition) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FFF0F3]">
        <div className="flex items-center gap-2 text-[#8F8F8F] text-xs font-mono">
          <Sparkles className="w-4 h-4 animate-spin text-[#FF91AC]" />
          Loading workflow canvas...
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-[#FFF0F3]">
      {/* Editor Sub-Header Toolbar */}
      <div className="h-12 bg-white border-b border-[#F8CDD6] px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-full text-[#8F8F8F] hover:text-[#161616] hover:bg-[#FFE4E9] transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#161616] truncate max-w-xs">
              {workflow.name}
            </h2>
            <Badge variant="neutral" dot>
              {workflow.status}
            </Badge>
            {saveBanner && (
              <span className="text-[11px] text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                SAVED
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Backend Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#8F8F8F] mr-2 border-r border-[#F8CDD6] pr-3">
            <Activity className="w-3.5 h-3.5 text-[#8F8F8F]" />
            <span className="text-[11px] font-mono">ENGINE:</span>
            <span
              className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {backendStatus.toUpperCase()}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8F8F8F] mr-1">
            <span className="flex items-center gap-1 font-mono">
              <Layers className="w-3.5 h-3.5 text-[#8F8F8F]" />
              {flowDefinition.nodes.length} NODES
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={() => setIsRunModalOpen(true)}
          >
            RUN PIPELINE
          </Button>
        </div>
      </div>

      {/* Main Visual Builder Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Interactive Node Library Palette */}
        <aside className="w-72 bg-white border-r border-[#F8CDD6] flex flex-col shrink-0 z-10 shadow-xs">
          {/* Palette Header */}
          <div className="p-3 border-b border-[#FFE4E9] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-semibold text-[#161616] tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF91AC]" />
                Node Library
              </span>
              <span className="text-[10px] bg-[#FFE4E9] text-[#161616] px-2 py-0.5 rounded-full font-mono">
                {NODE_TEMPLATES.length} Types
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8F8F8F] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={nodeSearch}
                onChange={(e) => setNodeSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-[#FFF0F3] border border-[#F8CDD6] rounded-full focus:outline-none focus:ring-1 focus:ring-[#FF91AC] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-[#FFE4E9] overflow-x-auto bg-[#FFF0F3]/70">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-full transition-colors whitespace-nowrap font-medium cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FFBCCA] text-[#212121] font-bold shadow-xs'
                    : 'text-[#8F8F8F] hover:text-[#161616] hover:bg-[#FFE4E9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Draggable Node Cards */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <p className="text-[11px] text-[#8F8F8F] font-mono mb-1 leading-snug">
              Drag nodes onto canvas:
            </p>

            {filteredTemplates.map((node) => {
              const Icon = node.icon
              return (
                <div
                  key={node.type}
                  className="p-3 rounded-[16px] border border-[#F8CDD6] bg-white hover:border-[#FF91AC] hover:shadow-sm transition-all cursor-grab active:cursor-grabbing select-none group"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', node.type)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg ${node.iconBg} flex items-center justify-center ${node.iconColor} border border-black/5 transition-colors`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-[#161616] group-hover:text-[#FF91AC] transition-colors">
                        {node.label}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#8F8F8F] bg-[#FFE4E9] px-1.5 py-0.5 rounded-full font-mono border border-black/5">
                      {node.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8F8F8F] leading-tight pl-8">
                    {node.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Palette Footer Tip */}
          <div className="p-3 border-t border-[#FFE4E9] bg-[#FFF0F3] text-[11px] text-[#8F8F8F] flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#8F8F8F] shrink-0" />
            <span className="text-[10px] font-mono leading-tight">
              Connect handles: Left (In) to Right (Out).
            </span>
          </div>
        </aside>

        {/* Live Interactive React Flow Canvas */}
        <WorkflowCanvas
          initialWorkflow={flowDefinition}
          onSaveWorkflow={handleSaveFlow}
          execution={latestExecution}
          isRunning={isRunning}
          activeTab={activeDrawerTab}
          onTabChange={setActiveDrawerTab}
        />
      </div>

      {/* Run Pipeline Modal Dialog */}
      <RunPipelineModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        workflow={flowDefinition}
        onExecute={handleExecutePipeline}
        isRunning={isRunning}
      />
    </div>
  )
}
