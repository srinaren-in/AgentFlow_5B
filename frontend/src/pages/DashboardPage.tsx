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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Agent Workflows</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Design, orchestrate, and observe visual AI agent pipelines with LangGraph and local or cloud LLMs.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/templates')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Recent Workflows</h2>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {filteredWorkflows.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter pipelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-44"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1 px-2.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="running">Running</option>
            </select>
          </div>
        </div>

        {filteredWorkflows.length === 0 ? (
          <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-lg">
            <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No workflows found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-800">Active Projects</h2>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
          >
            View all projects →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
