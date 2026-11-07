import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Workflow, WorkflowDefinition } from '@/types'
import { workflowService } from '@/services/workflowService'
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas'
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
} from 'lucide-react'

export const WorkflowEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [flowDefinition, setFlowDefinition] = useState<WorkflowDefinition | null>(null)
  const [nodeSearch, setNodeSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [saveBanner, setSaveBanner] = useState(false)

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
  }, [id])

  const handleSaveFlow = (updatedDef: WorkflowDefinition) => {
    if (!workflow) return
    workflowService.saveWorkflowDefinition(workflow.id, updatedDef)
    setFlowDefinition(updatedDef)
    setSaveBanner(true)
    setTimeout(() => setSaveBanner(false), 2000)
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
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
          <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
          Loading workflow canvas...
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-100">
      {/* Editor Sub-Header Toolbar */}
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 truncate max-w-xs">
              {workflow.name}
            </h2>
            <Badge variant="neutral" dot>
              {workflow.status}
            </Badge>
            {saveBanner && (
              <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-in fade-in">
                Saved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 mr-2">
            <span className="flex items-center gap-1 font-mono">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {flowDefinition.nodes.length} Nodes
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={() =>
              alert(
                'Visual canvas graph verified! LangGraph execution engine connects in Phase 6/7.'
              )
            }
          >
            Run Pipeline
          </Button>
        </div>
      </div>

      {/* Main Visual Builder Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Interactive Node Library Palette */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-xs">
          {/* Palette Header */}
          <div className="p-3 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Node Library
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                {NODE_TEMPLATES.length} Types
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={nodeSearch}
                onChange={(e) => setNodeSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 overflow-x-auto bg-slate-50/50">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors whitespace-nowrap font-medium ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Draggable Node Cards */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <p className="text-[11px] text-slate-400 mb-1 leading-snug">
              Drag nodes directly onto the canvas to wire logic:
            </p>

            {filteredTemplates.map((node) => {
              const Icon = node.icon
              return (
                <div
                  key={node.type}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all cursor-grab active:cursor-grabbing select-none group"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', node.type)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded ${node.iconBg} flex items-center justify-center ${node.iconColor} transition-colors`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {node.label}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono border border-slate-200/50">
                      {node.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight pl-8">
                    {node.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Palette Footer Tip */}
          <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[10px] leading-tight">
              Connect handles from left (Input) to right (Output).
            </span>
          </div>
        </aside>

        {/* Live Interactive React Flow Canvas */}
        <WorkflowCanvas
          initialWorkflow={flowDefinition}
          onSaveWorkflow={handleSaveFlow}
        />
      </div>
    </div>
  )
}
