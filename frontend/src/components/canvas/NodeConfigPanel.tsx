import React from 'react'
import { AgentFlowNode, CustomNodeType } from '@/types'
import { Input, Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { X, Trash2, Sliders, CheckCircle2 } from 'lucide-react'

interface NodeConfigPanelProps {
  selectedNode: AgentFlowNode | null
  onClose: () => void
  onUpdateNode: (nodeId: string, updates: Partial<AgentFlowNode['data']>) => void
  onDeleteNode: (nodeId: string) => void
}

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  selectedNode,
  onClose,
  onUpdateNode,
  onDeleteNode,
}) => {
  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <Sliders className="w-8 h-8 mb-2 text-slate-300" />
        <p className="text-xs font-medium text-slate-600">No node selected</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
          Click any node on the canvas to configure parameters, prompt templates, and model settings.
        </p>
      </div>
    )
  }

  const { data } = selectedNode
  const config = data.config || {}
  const nodeType = data.nodeType as CustomNodeType

  const updateConfig = (key: string, value: any) => {
    onUpdateNode(selectedNode.id, {
      config: {
        ...config,
        [key]: value,
      },
    })
  }

  const updateLabel = (label: string) => {
    onUpdateNode(selectedNode.id, { label })
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Inspector Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xs font-semibold text-slate-900 truncate">
            {data.label || 'Node Inspector'}
          </span>
          <span className="text-[10px] font-mono uppercase bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded">
            {nodeType.replace('Node', '')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete this node"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Controls Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* General Identity */}
        <div className="space-y-3 pb-3 border-b border-slate-100">
          <Input
            label="Node Display Name"
            value={data.label}
            onChange={(e) => updateLabel(e.target.value)}
            placeholder="Label on canvas"
          />
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Node ID: {selectedNode.id}</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Valid
            </span>
          </div>
        </div>

        {/* 1. Input Node Form */}
        {nodeType === 'inputNode' && (
          <div className="space-y-3">
            <Input
              label="Variable Name *"
              value={config.variableName || 'user_input'}
              onChange={(e) => updateConfig('variableName', e.target.value)}
              helperText="Downstream nodes reference this via {variableName}"
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Data Type</label>
              <select
                value={config.inputType || 'text'}
                onChange={(e) => updateConfig('inputType', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="text">Plain Text (string)</option>
                <option value="json">JSON Object</option>
                <option value="chat_message">Chat Message Payload</option>
              </select>
            </div>
            <Textarea
              label="Default Test Value"
              value={config.defaultValue || ''}
              onChange={(e) => updateConfig('defaultValue', e.target.value)}
              placeholder="Enter initial default value for testing..."
              rows={3}
            />
          </div>
        )}

        {/* 2. Output Node Form */}
        {nodeType === 'outputNode' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Output Format</label>
              <select
                value={config.outputFormat || 'markdown'}
                onChange={(e) => updateConfig('outputFormat', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="markdown">Markdown Text</option>
                <option value="text">Raw Plain Text</option>
                <option value="json">Structured JSON</option>
              </select>
            </div>
            <Input
              label="Response Payload Key"
              value={config.responseKey || 'result'}
              onChange={(e) => updateConfig('responseKey', e.target.value)}
              helperText="Key in final execution JSON return object"
            />
          </div>
        )}

        {/* 3. LLM Node Form */}
        {nodeType === 'llmNode' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Provider</label>
              <select
                value={config.provider || 'ollama'}
                onChange={(e) => {
                  const provider = e.target.value
                  updateConfig('provider', provider)
                  updateConfig('model', provider === 'ollama' ? 'qwen2.5:7b' : 'gemini-2.0-flash')
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ollama">Ollama (Local On-Premise)</option>
                <option value="gemini">Google Gemini (Cloud AI)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Model</label>
              <select
                value={config.model || (config.provider === 'gemini' ? 'gemini-2.0-flash' : 'qwen2.5:7b')}
                onChange={(e) => updateConfig('model', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              >
                {config.provider === 'gemini' ? (
                  <>
                    <option value="gemini-2.0-flash">gemini-2.0-flash (Recommended)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  </>
                ) : (
                  <>
                    <option value="qwen2.5:7b">qwen2.5:7b (Recommended)</option>
                    <option value="llama3.2:3b">llama3.2:3b</option>
                    <option value="mistral:7b">mistral:7b</option>
                    <option value="deepseek-r1:8b">deepseek-r1:8b</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Temperature</span>
                <span className="font-mono text-indigo-600 font-semibold">
                  {typeof config.temperature === 'number' ? config.temperature : 0.7}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={typeof config.temperature === 'number' ? config.temperature : 0.7}
                onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.0 (Precise)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            <Input
              label="Max Output Tokens"
              type="number"
              value={config.maxTokens || 2048}
              onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value, 10) || 2048)}
            />

            <Textarea
              label="System Instructions"
              value={config.systemPrompt || ''}
              onChange={(e) => updateConfig('systemPrompt', e.target.value)}
              placeholder="System prompt guiding model persona and rules..."
              rows={3}
            />
          </div>
        )}

        {/* 4. Prompt Template Node Form */}
        {nodeType === 'promptTemplateNode' && (
          <div className="space-y-3">
            <Textarea
              label="Prompt Template *"
              value={config.template || ''}
              onChange={(e) => {
                const val = e.target.value
                updateConfig('template', val)
                // Auto-detect {variables}
                const matches = Array.from(val.matchAll(/\{([a-zA-Z0-9_]+)\}/g)).map((m) => m[1])
                const unique = Array.from(new Set(matches))
                updateConfig('inputVariables', unique)
              }}
              placeholder="e.g. You are an expert {role}. Explain {topic} in 3 bullet points."
              rows={4}
              helperText="Enclose input variables in braces like {variable_name}"
            />

            <div>
              <span className="block text-xs font-medium text-slate-700 mb-1.5">
                Detected Input Variables ({config.inputVariables?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {config.inputVariables && config.inputVariables.length > 0 ? (
                  config.inputVariables.map((v: string) => (
                    <span
                      key={v}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono"
                    >
                      {`{${v}}`}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    No variables detected. Add `{'{query}'}` to create input handles.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. Conditional Node Form */}
        {nodeType === 'conditionalNode' && (
          <div className="space-y-3">
            <Input
              label="Payload Field to Test"
              value={config.field || 'input'}
              onChange={(e) => updateConfig('field', e.target.value)}
              placeholder="e.g. status, score, topic"
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Operator</label>
              <select
                value={config.operator || 'contains'}
                onChange={(e) => updateConfig('operator', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="contains">Contains substring</option>
                <option value="equals">Equals exact string</option>
                <option value="greater_than">Numeric &gt; Greater Than</option>
                <option value="less_than">Numeric &lt; Less Than</option>
                <option value="is_empty">Is Empty or Null</option>
              </select>
            </div>
            <Input
              label="Comparison Target Value"
              value={config.value || ''}
              onChange={(e) => updateConfig('value', e.target.value)}
              placeholder="Value to evaluate against"
            />
          </div>
        )}

        {/* 6. Python Tool Node Form */}
        {nodeType === 'pythonToolNode' && (
          <div className="space-y-3">
            <Input
              label="Function Name"
              value={config.functionName || 'transform_data'}
              onChange={(e) => updateConfig('functionName', e.target.value)}
            />
            <Textarea
              label="Python Code Body *"
              value={config.code || ''}
              onChange={(e) => updateConfig('code', e.target.value)}
              rows={6}
              className="font-mono text-xs"
              placeholder="def transform_data(args):&#10;    return {'status': 'processed'}"
            />
            <Input
              label="Execution Timeout (seconds)"
              type="number"
              value={config.timeoutSeconds || 10}
              onChange={(e) => updateConfig('timeoutSeconds', parseInt(e.target.value, 10) || 10)}
            />
          </div>
        )}

        {/* 7. HTTP Request Node Form */}
        {nodeType === 'httpRequestNode' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">HTTP Method</label>
              <select
                value={config.method || 'GET'}
                onChange={(e) => updateConfig('method', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <Input
              label="Target Endpoint URL *"
              value={config.url || ''}
              onChange={(e) => updateConfig('url', e.target.value)}
              placeholder="https://api.example.com/v1/resource"
            />
            <Textarea
              label="JSON Headers"
              value={config.headers || ''}
              onChange={(e) => updateConfig('headers', e.target.value)}
              rows={3}
              className="font-mono text-xs"
              placeholder={'{\n  "Authorization": "Bearer ..."\n}'}
            />
            <Textarea
              label="Request Body Template"
              value={config.bodyTemplate || ''}
              onChange={(e) => updateConfig('bodyTemplate', e.target.value)}
              rows={3}
              className="font-mono text-xs"
              placeholder={'{\n  "payload": "{{input}}"\n}'}
            />
          </div>
        )}

        {/* 8. Memory Node Form */}
        {nodeType === 'memoryNode' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Buffer Strategy</label>
              <select
                value={config.memoryType || 'window'}
                onChange={(e) => updateConfig('memoryType', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="window">Sliding Window (Last K turns)</option>
                <option value="buffer">Full Conversation History Buffer</option>
                <option value="summary">Summary Buffer (Token-optimized)</option>
              </select>
            </div>
            <Input
              label="Window Size (K turns)"
              type="number"
              value={config.windowSize || 10}
              onChange={(e) => updateConfig('windowSize', parseInt(e.target.value, 10) || 10)}
            />
            <Input
              label="Session Persistence Key"
              value={config.persistKey || 'session_chat_history'}
              onChange={(e) => updateConfig('persistKey', e.target.value)}
            />
          </div>
        )}

        {/* 9. Agent Node Form */}
        {nodeType === 'agentNode' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Agent Cognitive Architecture</label>
              <select
                value={config.architecture || 'flow'}
                onChange={(e) => updateConfig('architecture', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              >
                <option value="flow">Flow 4-Role (Planner → Executor → Verifier → Generator)</option>
                <option value="react">ReAct (Single-Loop LangGraph)</option>
              </select>
              <p className="text-[10px] text-slate-400">
                Flow 4-Role provides self-correcting intermediate validation based on lupantech/AgentFlow research.
              </p>
            </div>
            <Input
              label="Agent Role Title"
              value={config.role || 'Autonomous Researcher'}
              onChange={(e) => updateConfig('role', e.target.value)}
            />
            <Textarea
              label="High-Level Goal & Objectives"
              value={config.goal || ''}
              onChange={(e) => updateConfig('goal', e.target.value)}
              placeholder="What specific objective does this agent orchestrate?"
              rows={3}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Reasoning Core Model</label>
              <select
                value={config.model || 'gemini-2.0-flash'}
                onChange={(e) => updateConfig('model', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              >
                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                <option value="qwen2.5:7b">qwen2.5:7b (Local Ollama)</option>
              </select>
            </div>
            <Input
              label="Max Reflection Iterations"
              type="number"
              value={config.maxIterations || 5}
              onChange={(e) => updateConfig('maxIterations', parseInt(e.target.value, 10) || 5)}
              helperText="Safety boundary preventing infinite loops"
            />

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-800">Available Agent Tools</label>
              {[
                { id: 'calculator', label: 'Calculator', desc: 'Accurate safe math parser' },
                { id: 'wikipedia_search', label: 'Wikipedia Search', desc: 'RAG search for concepts & facts' },
                { id: 'http_request', label: 'HTTP Request', desc: 'Query live APIs and endpoints' },
                { id: 'python_interpreter', label: 'Python Sandbox', desc: 'Isolated subprocess execution' },
              ].map((tool) => {
                const tools = config.toolsEnabled || ['calculator', 'wikipedia_search', 'http_request', 'python_interpreter']
                const isChecked = tools.includes(tool.id)
                return (
                  <label
                    key={tool.id}
                    className="flex items-start gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...tools, tool.id]
                          : tools.filter((t: string) => t !== tool.id)
                        updateConfig('toolsEnabled', next)
                      }}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-medium text-slate-800 block">{tool.label}</span>
                      <span className="text-[10px] text-slate-400">{tool.desc}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeleteNode(selectedNode.id)}
          leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
        >
          Delete Node
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  )
}

