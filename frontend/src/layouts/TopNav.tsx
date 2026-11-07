import React from 'react'
import { PanelLeft, Plus, Search, ExternalLink } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useLocation, Link } from 'react-router-dom'

interface TopNavProps {
  onToggleSidebar: () => void
  onOpenCreateWorkflow: () => void
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar, onOpenCreateWorkflow }) => {
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Overview'
    if (path === '/dashboard') return 'Dashboard'
    if (path.startsWith('/editor')) return 'Workflow Canvas Editor'
    if (path.startsWith('/projects')) return 'Projects'
    if (path.startsWith('/templates')) return 'Workflow Templates'
    if (path.startsWith('/providers')) return 'Model Providers'
    if (path.startsWith('/settings')) return 'Settings & Environment'
    return 'AgentFlow'
  }

  return (
    <header className="h-14 bg-white border-b border-[#E5E5E5] px-4 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-full text-[#303030] hover:text-[#161616] hover:bg-[#F0F0F0] transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-[#161616]">{getPageTitle()}</span>
          <span className="text-[#D9D9D9]">/</span>
          <span className="text-xs text-[#8F8F8F] font-mono uppercase">AgentFlow</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 text-[#8F8F8F] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search workflows, nodes, tools..."
            className="w-64 pl-8 pr-3 py-1.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF91AC]/30 focus:border-[#FF91AC] focus:bg-white transition-colors"
          />
        </div>

        <Link to="/" className="text-xs font-mono uppercase text-[#303030] hover:text-[#161616] px-2.5 py-1 rounded-full hover:bg-[#F0F0F0] hidden sm:inline-block">
          Home
        </Link>

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
          className="p-1.5 text-[#8F8F8F] hover:text-[#161616] hover:bg-[#F0F0F0] rounded-full transition-colors hidden sm:inline-flex"
          title="Documentation"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </header>
  )
}
