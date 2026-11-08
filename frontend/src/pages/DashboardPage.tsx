import React, { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Workflow, Project, ModelProvider } from '@/types'
import { workflowService } from '@/services/workflowService'
import { StatsSummary } from '@/components/dashboard/StatsSummary'
import { WorkflowCard } from '@/components/dashboard/WorkflowCard'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { Button } from '@/components/common/Button'
import { Plus, Search, Layers, FolderKanban, Sparkles } from 'lucide-react'

interface OutletContextType {
  onOpenCreateModal: () => void
}

export const DashboardPage: React.FC = () => {
  const { onOpenCreateModal } = useOutletContext<OutletContextType>()
  const navigate = useNavigate()

  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [providers, setProviders] = useState<ModelProvider[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const loadData = () => {
    setWorkflows(workflowService.getWorkflows())
    setProjects(workflowService.getProjects())
    setProviders(workflowService.getModelProviders())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeleteWorkflow = (id: string) => {
    workflowService.deleteWorkflow(id)
    loadData()
  }

  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || w.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header & Main Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#161616] tracking-tight">AI Agent Workflows</h1>
          <p className="text-xs text-[#8F8F8F] font-mono mt-0.5">
            Design, orchestrate, and observe visual AI agent pipelines with LangGraph & Flow-4Role.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/templates')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#FF91AC]" />}
          >
            Explore Templates
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Real Statistics Overview */}
      <StatsSummary workflows={workflows} projects={projects} providers={providers} />

      {/* Recent Workflows Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F8CDD6] pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#161616]">Recent Workflows</h2>
            <span className="text-[10px] font-mono uppercase bg-[#FFE4E9] text-[#161616] px-2 py-0.5 rounded-full border border-black/5">
              {filteredWorkflows.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8F8F8F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter pipelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#F8CDD6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF91AC]/30 focus:border-[#FF91AC] w-48 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-[#F8CDD6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF91AC]/30 focus:border-[#FF91AC] text-[#303030] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="running">Running</option>
            </select>
          </div>
        </div>

        {filteredWorkflows.length === 0 ? (
          <div className="p-12 text-center bg-white border border-dashed border-[#F8CDD6] rounded-[24px]">
            <Layers className="w-8 h-8 text-[#8F8F8F] mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-[#161616]">No workflows found</h3>
            <p className="text-xs text-[#8F8F8F] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? 'No workflows match your search query or filter.'
                : 'Get started by creating your first AI workflow pipeline.'}
            </p>
            <div className="mt-4">
              <Button variant="primary" size="sm" onClick={onOpenCreateModal}>
                Create New Workflow
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onDelete={handleDeleteWorkflow}
              />
            ))}
          </div>
        )}
      </div>

      {/* Projects Overview */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#F8CDD6] pb-3">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-[#161616]" />
            <h2 className="text-sm font-semibold text-[#161616]">Active Projects</h2>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-mono uppercase text-[#303030] hover:text-[#FF91AC] transition-colors"
          >
            View all projects →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={() => navigate('/projects')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
