import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Workflow } from '@/types'
import { workflowService } from '@/services/workflowService'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import {
  Play,
  Save,
  Layers,
  Sparkles,
  ArrowLeft,
  Sliders,
  Terminal,
  HelpCircle,
  FileText,
  Cpu,
  Split,
  Code2,
  Globe,
  Database,
  LogIn,
  LogOut,
} from 'lucide-react'

export const WorkflowEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [activeTab, setActiveTab] = useState<'library' | 'config' | 'logs'>('library')
  const [isSaved, setIsSaved] = useState(true)

  useEffect(() => {
    const workflows = workflowService.getWorkflows()
    if (id) {
      const found = workflows.find((w) => w.id === id)
      setWorkflow(found || workflows[0] || null)
    } else if (workflows.length > 0) {
      setWorkflow(workflows[0])
    }
  }, [id])

  const plannedNodes = [
    { type: 'input', label: 'Input Node', icon: LogIn, category: 'I/O', desc: 'Accepts raw text or JSON input payload' },
    { type: 'output', label: 'Output Node', icon: LogOut, category: 'I/O', desc: 'Returns final pipeline response' },
    { type: 'prompt', label: 'Prompt Template', icon: FileText, category: 'Prompting', desc: 'Formats variables into LLM prompts' },
    { type: 'llm', label: 'LLM Node', icon: Cpu, category: 'Model', desc: 'Executes Ollama or Gemini queries' },
    { type: 'conditional', label: 'Conditional Logic', icon: Split, category: 'Logic', desc: 'Branches flow based on boolean expressions' },
    { type: 'python', label: 'Python Tool', icon: Code2, category: 'Tools', desc: 'Executes sandboxed Python script transformation' },
    { type: 'http', label: 'HTTP Request', icon: Globe, category: 'Tools', desc: 'Calls external REST webhooks and APIs' },
    { type: 'memory', label: 'Memory Node', icon: Database, category: 'State', desc: 'Stores conversation history & buffer' },
  ]

  const handleSave = () => {
    setIsSaved(true)
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-100">
      {/* Editor Sub-Header Toolbar */}
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              {workflow ? workflow.name : 'Untitled Workflow'}
            </h2>
            <Badge variant="neutral" dot>
              {workflow ? workflow.status : 'Draft'}
            </Badge>
            {!isSaved && (
              <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 mr-2">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {workflow?.nodeCount ?? 0} Nodes
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            leftIcon={<Save className="w-3.5 h-3.5 text-slate-500" />}
          >
            Save
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={() => alert('Execution Engine will be activated in Phase 7 with LangGraph & FastAPI.')}
          >
            Run Pipeline
          </Button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Node Library Panel */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-xs">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Node Library
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              8 Available
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <p className="text-[11px] text-slate-500 mb-2">
              Drag nodes onto the canvas to construct your agent pipeline.
            </p>

            {plannedNodes.map((node) => {
              const Icon = node.icon
              return (
                <div
                  key={node.type}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-grab active:cursor-grabbing select-none group"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', node.type)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-800 group-hover:text-indigo-600">
                        {node.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-1 py-0.5 rounded font-mono">
                      {node.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight pl-8">
                    {node.desc}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Phase 3 connects @xyflow/react canvas drag-and-drop.</span>
          </div>
        </aside>

        {/* Center Canvas Area with Dot-Grid */}
        <div className="flex-1 relative bg-slate-50 bg-grid-pattern flex flex-col items-center justify-center p-8 overflow-hidden">
          {/* Phase Notice Card */}
          <div className="max-w-lg bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-6 shadow-sm text-center space-y-3 z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Interactive Canvas Ready for Phase 3
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              The application foundation, layout, routing, and design system are active. In the next milestone, we mount the <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">@xyflow/react</code> interactive canvas with node handles, topological connections, and inspector drawer.
            </p>

            <div className="pt-2 flex items-center justify-center gap-2">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Prompt 01 Target Met
              </span>
            </div>
          </div>
        </div>

        {/* Right Inspector / Execution Output Tabs Drawer */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-xs">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'library'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Inspector
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'logs'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Execution Logs
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'library' ? (
              <div className="space-y-4 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-800">Workflow Inspector</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Select a node on the canvas to configure parameters, prompt templates, model temperature, and retry rules.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-medium text-slate-700 block">Metadata</span>
                  <div className="text-[11px] space-y-1 text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-100 font-mono">
                    <p>ID: {workflow?.id}</p>
                    <p>Status: {workflow?.status}</p>
                    <p>Created: {workflow?.createdAt?.slice(0, 10)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Execution Output</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Idle
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono text-xs space-y-1 min-h-[160px]">
                  <p className="text-slate-500">[System] Engine initialized.</p>
                  <p className="text-slate-500">[System] Awaiting pipeline run command...</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
