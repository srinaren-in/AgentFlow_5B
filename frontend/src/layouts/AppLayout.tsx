import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { CreateWorkflowModal } from '@/components/dashboard/CreateWorkflowModal'
import { workflowService } from '@/services/workflowService'
import { cn } from '@/lib/utils'

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const navigate = useNavigate()

  const projects = workflowService.getProjects()

  const handleCreateWorkflow = (data: {
    name: string
    description: string
    projectId?: string
    tags: string[]
  }) => {
    const created = workflowService.createWorkflow(data)
    setCreateModalOpen(false)
    navigate(`/editor/${created.id}`)
  }

  return (
    <div className="min-h-screen bg-[#FFF0F3] flex flex-col font-sans text-[#1A1114]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-200 ease-in-out',
          sidebarOpen ? 'pl-60' : 'pl-16'
        )}
      >
        <TopNav
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenCreateWorkflow={() => setCreateModalOpen(true)}
        />

        <main className="flex-1 flex flex-col">
          <Outlet context={{ onOpenCreateModal: () => setCreateModalOpen(true) }} />
        </main>
      </div>

      <CreateWorkflowModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        projects={projects}
        onCreate={handleCreateWorkflow}
      />
    </div>
  )
}

