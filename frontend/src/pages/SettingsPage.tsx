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
    if (confirm('Reset local mock workflows and settings to factory defaults?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure AgentFlow runtime endpoints, execution parameters, and local data.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Backend API Connection</h3>
              <p className="text-xs text-slate-500">FastAPI backend runtime for graph validation and LangGraph execution.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="FastAPI Backend URL"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              helperText="The endpoint where Python LangGraph engine runs (configured in Phase 6)."
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
                <label className="block text-xs font-medium text-slate-700">Logging Verbosity</label>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                >
                  <option value="debug">Debug (All step payloads)</option>
                  <option value="info">Info (Default: node starts, completions, errors)</option>
                  <option value="warn">Warning (Only retries and warnings)</option>
                  <option value="error">Error (Only pipeline failures)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h3 className="text-sm font-semibold text-rose-900">Data Management & Reset</h3>
              <p className="text-xs text-slate-500">Reset local workspace data, custom workflows, or clear state.</p>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-700 font-medium">Reset Local Data to Defaults</p>
              <p className="text-xs text-slate-500">
                Restores starter workflows, default projects, and resets mock storage.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetData}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Data
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}

