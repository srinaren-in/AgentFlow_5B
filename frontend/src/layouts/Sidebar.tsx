import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Home,
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
    { label: 'Home Page', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Workflow Editor', path: '/editor', icon: Workflow },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Templates', path: '/templates', icon: Sparkles },
    { label: 'Model Providers', path: '/providers', icon: Cpu },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-[#212121] text-slate-300 border-r border-[#333333] transition-all duration-200 ease-in-out',
        isOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 h-14 px-4 border-b border-[#333333] shrink-0">
        <Link to="/" className="w-8 h-8 rounded-full bg-[#FFBCCA] text-[#212121] flex items-center justify-center shrink-0 shadow-sm hover:bg-[#FF91AC] transition-colors">
          <Bot className="w-5 h-5" />
        </Link>
        {isOpen && (
          <div className="flex items-center justify-between flex-1 overflow-hidden">
            <Link to="/" className="font-semibold text-[#FFF0F3] text-sm tracking-tight truncate hover:text-[#FFBCCA] transition-colors">
              AgentFlow
            </Link>
            <span className="text-[10px] font-mono uppercase bg-[#303030] text-[#FFBCCA] px-2 py-0.5 rounded-full border border-white/5">
              v1.0
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
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all group relative',
                  isActive
                    ? 'bg-[#FFBCCA]/15 text-[#FFBCCA] font-bold border border-[#FF91AC]/30'
                    : 'text-[#8F8F8F] hover:text-[#FFF0F3] hover:bg-white/5'
                )
              }
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
              {isOpen && <span className="truncate">{item.label}</span>}
              {isOpen && item.path === '/editor' && (
                <span className="ml-auto text-[9px] bg-[#303030] text-[#FFBCCA] px-1.5 py-0.5 rounded-full font-mono">
                  CANVAS
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Runtime Status Pill */}
      {isOpen ? (
        <div className="p-3 m-2 rounded-[16px] bg-[#303030]/60 border border-[#444444] text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono uppercase text-[#8F8F8F]">Engine</span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#FFBCCA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF91AC] animate-pulse" />
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            FastAPI + LangGraph + Flow 4-Role runtime.
          </p>
        </div>
      ) : (
        <div className="p-2 flex justify-center mb-2">
          <span className="w-2 h-2 rounded-full bg-[#FFBCCA]" title="Engine Ready" />
        </div>
      )}

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[#333333] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-[#FFBCCA] text-[#212121] flex items-center justify-center text-xs font-bold font-mono">
            AF
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-[#FFF0F3] truncate">Builder Admin</p>
              <p className="text-[10px] text-[#8F8F8F] truncate font-mono">dev@agentflow.io</p>
            </div>
          )}
        </div>
        {isOpen && <ChevronRight className="w-3.5 h-3.5 text-[#8F8F8F]" />}
      </div>
    </aside>
  )
}
