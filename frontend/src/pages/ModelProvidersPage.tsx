import React, { useState, useEffect } from 'react'
import { workflowService } from '@/services/workflowService'
import { apiService } from '@/services/api'
import { Card, CardHeader, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { ShieldCheck, HardDrive, Cloud, AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react'

export const ModelProvidersPage: React.FC = () => {
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434')
  const [liveStatus, setLiveStatus] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')

  const checkLiveStatus = async () => {
    setIsRefreshing(true)
    const status = await apiService.getProvidersStatus()
    setLiveStatus(status)
    setIsRefreshing(false)
  }

  useEffect(() => {
    checkLiveStatus()
  }, [])

  const isOllamaOnline = liveStatus?.ollama?.status === 'available'
  const isGeminiReady = liveStatus?.gemini?.status === 'available' || liveStatus?.gemini?.status === 'configured'
  const discoveredOllamaModels = liveStatus?.ollama?.models || ['qwen2.5:7b', 'llama3.2:3b', 'mistral:7b', 'deepseek-r1:8b']

  const handleSaveOllama = () => {
    workflowService.updateModelProvider('ollama', {
      endpoint: ollamaEndpoint,
      isConfigured: true,
    })
    setSaveSuccess('Ollama configuration saved.')
    checkLiveStatus()
    setTimeout(() => setSaveSuccess(''), 3000)
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Model Providers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure local runtimes (Ollama) and cloud APIs (Google Gemini) for workflow nodes.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkLiveStatus}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Check Connectivity
        </Button>
      </div>

      {/* Security Architecture Notice */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-lg flex items-start gap-3 text-xs leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">Zero-Leakage Security Policy</span>
          <p className="text-slate-400 mt-1">
            Cloud API keys (e.g. <code className="text-indigo-300">GEMINI_API_KEY</code>) are strictly read from the backend server environment (<code className="text-indigo-300">backend/.env</code>) and are never transmitted to or cached within client-side browser bundles.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ollama Local Provider Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Ollama (Local LLM)</h3>
                <span className="text-[11px] text-slate-500">Private on-premise execution</span>
              </div>
            </div>
            <Badge variant={isOllamaOnline ? 'success' : 'neutral'} dot>
              {isOllamaOnline ? 'Live & Available' : 'Offline'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Runs Qwen 2.5, Llama 3.2, Mistral, and DeepSeek directly on your hardware with no internet connection required.
            </p>

            <Input
              label="Ollama Server Endpoint"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              helperText="Default Ollama host is http://localhost:11434"
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Installed Models ({discoveredOllamaModels.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {discoveredOllamaModels.map((m: string) => (
                  <span
                    key={m}
                    className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button variant="secondary" size="sm" onClick={handleSaveOllama}>
                Update Endpoint
              </Button>
              <a
                href="https://ollama.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Ollama Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Google Gemini Cloud Provider Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Google Gemini</h3>
                <span className="text-[11px] text-slate-500">Cloud AI Reasoning Models</span>
              </div>
            </div>
            <Badge variant={isGeminiReady ? 'success' : 'warning'} dot>
              {isGeminiReady ? 'Active Key' : 'Backend Managed'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast multimodal reasoning engine for advanced agent flows, complex tool planning, and multi-turn workflows.
            </p>

            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-md text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Backend Configuration Required
              </div>
              <p className="text-[11px] text-amber-800">
                In Phase 6 & 9, provide <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">backend/.env</code>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Supported Models
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'].map((m) => (
                  <span
                    key={m}
                    className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">Status: Read from backend</span>
              <a
                href="https://ai.google.dev"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Get Gemini Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
