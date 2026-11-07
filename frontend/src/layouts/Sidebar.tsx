import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Workflow,
  FolderKanban,
  Sparkles,
  Cpu,
  Settings,
  ChevronRight,
  Bot,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Workflow Editor', path: '/editor', icon: Workflow },
    { label: 'n8n Showcase', path: '/n8n', icon: Sparkles },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Templates', path: '/templates', icon: Sparkles },
    { label: 'Model Providers', path: '/providers', icon: Cpu },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-200 ease-in-out',
        isOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 h-14 px-4 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
          <Bot className="w-5 h-5" />
        </div>
        {isOpen && (
          <div className="flex items-center justify-between flex-1 overflow-hidden">
            <span className="font-semibold text-slate-100 text-sm tracking-tight truncate">
              AgentFlow
            </span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-indigo-400 px-1.5 py-0.5 rounded border border-slate-700">
              dev
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors group relative',
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )
              }
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
              {isOpen && <span className="truncate">{item.label}</span>}
              {isOpen && item.path === '/editor' && (
                <span className="ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                  Canvas
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Runtime Status Pill */}
      {isOpen ? (
        <div className="p-3 m-2 rounded-lg bg-slate-800/70 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-400">Agent Engine</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            FastAPI runtime & LangGraph executor bridge.
          </p>
        </div>
      ) : (
        <div className="p-2 flex justify-center mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Engine Ready" />
        </div>
      )}

      {/* Bottom Profile / Info */}
      <div className="p-3 border-t border-slate-800 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 shrink-0">
            AF
          </div>
          {isOpen && (
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">Workspace</p>
              <p className="text-[10px] text-slate-500 truncate">Local Developer</p>
            </div>
          )}
        </div>
        {isOpen && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
      </div>
    </aside>
  )
}

