import React from 'react'
import { PanelLeft, Plus, Search, ExternalLink } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useLocation } from 'react-router-dom'

interface TopNavProps {
  onToggleSidebar: () => void
  onOpenCreateWorkflow: () => void
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar, onOpenCreateWorkflow }) => {
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Dashboard'
    if (path.startsWith('/editor')) return 'Workflow Canvas Editor'
    if (path.startsWith('/projects')) return 'Projects'
    if (path.startsWith('/templates')) return 'Workflow Templates'
    if (path.startsWith('/providers')) return 'Model Providers'
    if (path.startsWith('/settings')) return 'Settings & Environment'
    return 'AgentFlow'
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Toggle Navigation Menu"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-slate-900">{getPageTitle()}</span>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-slate-500">AgentFlow Engine</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search workflows, nodes, tools..."
            className="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-colors"
          />
        </div>

        <Button
          onClick={onOpenCreateWorkflow}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Workflow
        </Button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors hidden sm:inline-flex"
          title="Documentation"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </header>
  )
}
