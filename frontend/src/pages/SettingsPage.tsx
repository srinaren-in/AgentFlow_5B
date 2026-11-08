import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { CheckCircle2, RotateCcw } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000')
  const [timeoutSeconds, setTimeoutSeconds] = useState('60')
  const [logLevel, setLogLevel] = useState('info')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleResetData = () => {
    if (confirm('Reset local workflows and settings to factory defaults?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-semibold text-[#161616] tracking-tight">System Settings</h1>
        <p className="text-xs text-[#8F8F8F] font-mono mt-0.5">
          Configure AgentFlow runtime endpoints, execution parameters, and local data.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[16px] flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-sm font-semibold text-[#161616]">Backend API Connection</h3>
              <p className="text-xs text-[#8F8F8F]">FastAPI runtime for graph validation and LangGraph execution.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="FastAPI Backend URL"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              helperText="The endpoint where Python LangGraph engine runs."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Execution Timeout (seconds)"
                type="number"
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(e.target.value)}
                helperText="Maximum allowed execution time before terminating agent pipeline."
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#161616]">Logging Verbosity</label>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#F8CDD6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF91AC]/30 focus:border-[#FF91AC] text-[#303030]"
                >
                  <option value="debug">DEBUG (Verbose Trace)</option>
                  <option value="info">INFO (Standard Production)</option>
                  <option value="warning">WARNING (Degraded only)</option>
                  <option value="error">ERROR (Failures only)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-rose-200">
          <CardHeader className="bg-rose-50/40">
            <div>
              <h3 className="text-sm font-semibold text-rose-900">Danger Zone</h3>
              <p className="text-xs text-rose-700">Irreversible application reset operations.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-[#303030]">
              Clears browser local storage caches, reset all saved workflows, and restores factory demo state.
            </p>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleResetData}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset All Local Workflows
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
