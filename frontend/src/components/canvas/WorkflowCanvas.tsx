import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  BackgroundVariant,
  Connection,
  Edge,
  MarkerType,
} from '@xyflow/react'
import { nodeTypes } from './nodes'
import { createNewNode, isValidConnection } from './nodeLibrary'
import { NodeConfigPanel } from './NodeConfigPanel'
import { ExecutionPanel } from './ExecutionPanel'
import { ExecutionResponse } from '@/services/api'
import { AgentFlowNode, CustomNodeType, WorkflowDefinition } from '@/types'
import {
  Save,
  RotateCcw,
  RotateCw,
  Download,
  Upload,
  Maximize2,
  AlertTriangle,
  CheckCircle,
  Sliders,
  Terminal,
} from 'lucide-react'
import { Button } from '@/components/common/Button'

interface WorkflowCanvasProps {
  initialWorkflow: WorkflowDefinition
  onSaveWorkflow: (workflow: WorkflowDefinition) => void
  execution?: ExecutionResponse | null
  isRunning?: boolean
  activeTab?: 'config' | 'logs'
  onTabChange?: (tab: 'config' | 'logs') => void
}

interface HistorySnapshot {
  nodes: AgentFlowNode[]
  edges: Edge[]
}

export const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({
  initialWorkflow,
  onSaveWorkflow,
  execution = null,
  isRunning = false,
  activeTab = 'config',
  onTabChange,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { screenToFlowPosition, fitView } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState<AgentFlowNode>(initialWorkflow.nodes || [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialWorkflow.edges || [])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<string>('')
  const [validationAlert, setValidationAlert] = useState<string | null>(null)

  // Undo / Redo history stacks
  const [history, setHistory] = useState<HistorySnapshot[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  // Record history snapshot on structural change
  const pushHistorySnapshot = useCallback(
    (newNodes: AgentFlowNode[], newEdges: Edge[]) => {
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1)
        return [...next, { nodes: newNodes, edges: newEdges }]
      })
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex]
  )

  // Initial history push
  useEffect(() => {
    if (history.length === 0 && initialWorkflow.nodes) {
      setHistory([{ nodes: initialWorkflow.nodes, edges: initialWorkflow.edges }])
      setHistoryIndex(0)
    }
  }, [initialWorkflow, history.length])

  // Sync live execution states to node data on the canvas
  useEffect(() => {
    if (isRunning) {
      setNodes((currentNodes) =>
        currentNodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            executionStatus: 'running',
          },
        }))
      )
    } else if (execution && execution.node_states) {
      setNodes((currentNodes) =>
        currentNodes.map((n) => {
          const state = execution.node_states[n.id]
          if (state) {
            return {
              ...n,
              data: {
                ...n.data,
                executionStatus: state.status,
                executionError: state.error,
              },
            }
          }
          return n
        })
      )
    }
  }, [execution, isRunning, setNodes])

  // Handle connecting edges
  const onConnect = useCallback(
    (params: Connection) => {
      const check = isValidConnection(params, nodes, edges)
      if (!check.isValid) {
        setValidationAlert(check.message || 'Invalid connection')
        setTimeout(() => setValidationAlert(null), 3500)
        return
      }

      const newEdge: Edge = {
        ...params,
        id: `e_${params.source}_${params.sourceHandle || 'def'}__${params.target}_${params.targetHandle || 'def'}`,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: '#FF91AC',
        },
        style: { stroke: '#FF91AC', strokeWidth: 2 },
      }

      setEdges((eds) => {
        const updated = addEdge(newEdge, eds)
        pushHistorySnapshot(nodes, updated)
        return updated
      })
    },
    [nodes, edges, setEdges, pushHistorySnapshot]
  )

  // Drag-and-drop handler from Node Library Palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow') as CustomNodeType
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = createNewNode(type, position)

      setNodes((nds) => {
        const updated = nds.concat(newNode)
        pushHistorySnapshot(updated, edges)
        return updated
      })

      setSelectedNodeId(newNode.id)
    },
    [screenToFlowPosition, setNodes, edges, pushHistorySnapshot]
  )

  // Node selection handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: AgentFlowNode) => {
    setSelectedNodeId(node.id)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  // Node updates from Configuration Inspector
  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<AgentFlowNode['data']>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updates,
              },
            }
          }
          return node
        })
      )
    },
    [setNodes]
  )

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const updated = nds.filter((n) => n.id !== nodeId)
        setEdges((eds) => {
          const cleanEdges = eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
          pushHistorySnapshot(updated, cleanEdges)
          return cleanEdges
        })
        return updated
      })
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null)
      }
    },
    [selectedNodeId, setNodes, setEdges, pushHistorySnapshot]
  )

  // Undo / Redo actions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1
      const snapshot = history[targetIndex]
      setNodes(snapshot.nodes)
      setEdges(snapshot.edges)
      setHistoryIndex(targetIndex)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1
      const snapshot = history[targetIndex]
      setNodes(snapshot.nodes)
      setEdges(snapshot.edges)
      setHistoryIndex(targetIndex)
    }
  }

  // Save workflow payload
  const handleSave = () => {
    const payload: WorkflowDefinition = {
      ...initialWorkflow,
      nodes,
      edges,
      metadata: {
        ...initialWorkflow.metadata,
        updatedAt: new Date().toISOString(),
      },
    }
    onSaveWorkflow(payload)
    setSaveStatus('Workflow saved.')
    setTimeout(() => setSaveStatus(''), 2500)
  }

  // Export JSON file
  const handleExportJSON = () => {
    const exportData: WorkflowDefinition = {
      ...initialWorkflow,
      nodes,
      edges,
      metadata: {
        ...initialWorkflow.metadata,
        updatedAt: new Date().toISOString(),
      },
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', jsonString)
    downloadAnchor.setAttribute(
      'download',
      `${initialWorkflow.name.toLowerCase().replace(/\s+/g, '_')}_flow.json`
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Import JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as WorkflowDefinition
        if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
          throw new Error('Invalid AgentFlow workflow JSON: missing nodes array.')
        }

        setNodes(parsed.nodes)
        setEdges(parsed.edges || [])
        pushHistorySnapshot(parsed.nodes, parsed.edges || [])
        setSaveStatus(`Imported ${parsed.nodes.length} nodes successfully.`)
        setTimeout(() => setSaveStatus(''), 3000)
        setTimeout(() => fitView({ padding: 0.2 }), 100)
      } catch (err: any) {
        setValidationAlert(`Import failed: ${err.message || 'Invalid JSON file'}`)
        setTimeout(() => setValidationAlert(null), 4000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null

  return (
    <div className="flex-1 flex overflow-hidden relative w-full h-full">
      {/* Hidden file input for importing JSON */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json"
        className="hidden"
      />

      {/* Canvas Workspace Area */}
      <div className="flex-1 relative h-full flex flex-col" ref={reactFlowWrapper}>
        {/* Top Floating Control Bar */}
        <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-xs pointer-events-auto">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-px bg-slate-200 mx-0.5" />
            <button
              onClick={() => fitView({ padding: 0.2 })}
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Fit View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-px bg-slate-200 mx-0.5" />
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              title="Export Workflow JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              title="Import Workflow JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {saveStatus && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md shadow-xs animate-in fade-in">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                {saveStatus}
              </span>
            )}
            {validationAlert && (
              <span className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md shadow-xs animate-in fade-in">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                {validationAlert}
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="w-3.5 h-3.5 text-slate-500" />}
            >
              Save Workflow
            </Button>
          </div>
        </div>

        {/* React Flow Core Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
          className="bg-[#FFF0F3]"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1.5}
            color="#F0AEC0"
            className="opacity-75"
          />
          <Controls position="bottom-left" showInteractive={false} />
          <MiniMap
            position="bottom-right"
            nodeColor={(n) => {
              switch (n.type) {
                case 'inputNode':
                  return '#0284c7'
                case 'outputNode':
                  return '#059669'
                case 'llmNode':
                  return '#FF91AC'
                case 'agentNode':
                  return '#FFBCCA'
                case 'pythonToolNode':
                  return '#10b981'
                case 'conditionalNode':
                  return '#d97706'
                case 'httpRequestNode':
                  return '#2563eb'
                case 'memoryNode':
                  return '#0d9488'
                default:
                  return '#64748b'
              }
            }}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
        </ReactFlow>
      </div>

      {/* Right Drawer: Inspector & Execution Monitoring Panel */}
      <aside className="w-80 bg-white border-l border-[#F8CDD6] flex flex-col shrink-0 z-20 shadow-xs">
        {/* Drawer Tabs */}
        <div className="flex border-b border-[#F8CDD6] shrink-0 font-mono uppercase text-xs">
          <button
            onClick={() => onTabChange?.('config')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'border-[#FF91AC] text-[#161616] bg-[#FFF0F3]'
                : 'border-transparent text-[#8F8F8F] hover:text-[#161616]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>
          <button
            onClick={() => onTabChange?.('logs')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'border-[#FF91AC] text-[#161616] bg-[#FFF0F3]'
                : 'border-transparent text-[#8F8F8F] hover:text-[#161616]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Logs</span>
            {execution && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  execution.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'config' ? (
            <NodeConfigPanel
              selectedNode={selectedNode}
              onClose={() => setSelectedNodeId(null)}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
            />
          ) : (
            <ExecutionPanel execution={execution} isRunning={isRunning} />
          )}
        </div>
      </aside>
    </div>
  )
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
