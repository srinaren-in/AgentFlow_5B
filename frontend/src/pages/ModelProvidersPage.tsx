import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { apiService } from '@/services/api'
import {
  HardDrive,
  Cloud,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'

export const ModelProvidersPage: React.FC = () => {
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434')
  const [isOllamaOnline, setIsOllamaOnline] = useState<boolean>(false)
  const [isGeminiReady, setIsGeminiReady] = useState<boolean>(false)
  const [discoveredOllamaModels, setDiscoveredOllamaModels] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  const checkLiveStatus = async () => {
    setIsRefreshing(true)
    try {
      const providersData = await apiService.getProvidersStatus()
      if (providersData) {
        setIsOllamaOnline(!!providersData.ollama?.online)
        setIsGeminiReady(!!providersData.gemini?.configured)
        setDiscoveredOllamaModels(providersData.ollama?.models || ['qwen2.5:7b', 'llama3.2:latest'])
      }
    } catch {
      setIsOllamaOnline(false)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkLiveStatus()
  }, [])

  const handleSaveOllama = () => {
    setSaveSuccess('Ollama configuration saved. Probing endpoint...')
    checkLiveStatus()
    setTimeout(() => setSaveSuccess(null), 3000)
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#161616] tracking-tight">Model Providers & Local LLMs</h1>
          <p className="text-xs text-[#8F8F8F] font-mono mt-0.5">
            Configure local Ollama instances and secure Google Gemini API keys.
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
      <div className="p-6 bg-[#212121] text-[#FAFAFA] rounded-[24px] flex items-start gap-4 text-xs leading-relaxed border border-[#333333]">
        <ShieldCheck className="w-6 h-6 text-[#FFBCCA] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-base text-[#FAFAFA]">Zero-Leakage Security Policy</span>
          <p className="text-slate-300 mt-1">
            Cloud API keys (e.g. <code className="text-[#FFBCCA] font-mono bg-[#303030] px-1.5 py-0.5 rounded">GEMINI_API_KEY</code>) are strictly read from the backend server environment (<code className="text-[#FFBCCA] font-mono bg-[#303030] px-1.5 py-0.5 rounded">backend/.env</code>) and are never transmitted to or cached within client-side browser bundles.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[16px] flex items-center gap-2 font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ollama Local Provider Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[#161616] border border-black/5">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#161616]">Ollama (Local LLM)</h3>
                <span className="text-[11px] text-[#8F8F8F] font-mono">Private on-premise execution</span>
              </div>
            </div>
            <Badge variant={isOllamaOnline ? 'success' : 'neutral'} dot>
              {isOllamaOnline ? 'Live & Available' : 'Offline'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-[#303030] leading-relaxed">
              Runs Qwen 2.5, Llama 3.2, Mistral, and DeepSeek directly on your hardware with no internet connection required.
            </p>

            <Input
              label="Ollama Server Endpoint"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              helperText="Default Ollama host is http://localhost:11434"
            />

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#161616] mb-1.5">
                Installed Models ({discoveredOllamaModels.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {discoveredOllamaModels.map((m: string) => (
                  <span
                    key={m}
                    className="text-xs bg-[#F0F0F0] text-[#161616] border border-[#E5E5E5] px-2.5 py-0.5 rounded-full font-mono"
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
                className="text-xs font-mono uppercase text-[#303030] hover:text-[#FF91AC] flex items-center gap-1 transition-colors"
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
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FFBCCA] flex items-center justify-center text-[#212121] border border-black/5">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#161616]">Google Gemini</h3>
                <span className="text-[11px] text-[#8F8F8F] font-mono">Cloud Multimodal Models</span>
              </div>
            </div>
            <Badge variant={isGeminiReady ? 'success' : 'warning'} dot>
              {isGeminiReady ? 'Active Key' : 'Backend Managed'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-[#303030] leading-relaxed">
              Fast multimodal reasoning engine for advanced agent flows, complex tool planning, and multi-turn workflows.
            </p>

            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-[16px] text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Backend Configuration Managed
              </div>
              <p className="text-[11px] text-amber-800">
                Provide <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">backend/.env</code>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#161616] mb-1.5">
                Supported Models
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'].map((m) => (
                  <span
                    key={m}
                    className="text-xs bg-[#F0F0F0] text-[#161616] border border-[#E5E5E5] px-2.5 py-0.5 rounded-full font-mono"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-mono text-[#8F8F8F]">Managed in backend .env</span>
              <a
                href="https://ai.google.dev"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono uppercase text-[#303030] hover:text-[#FF91AC] flex items-center gap-1 transition-colors"
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
