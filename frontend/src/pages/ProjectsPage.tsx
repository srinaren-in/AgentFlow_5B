import React, { useState, useEffect } from 'react'
import { Project } from '@/types'
import { workflowService } from '@/services/workflowService'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input, Textarea } from '@/components/common/Input'
import { Plus, FolderKanban, FolderPlus } from 'lucide-react'

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#4f46e5')
  const [error, setError] = useState('')

  const loadProjects = () => {
    setProjects(workflowService.getProjects())
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Project name is required.')
      return
    }

    workflowService.createProject({
      name,
      description,
      color,
    })

    setName('')
    setDescription('')
    setColor('#4f46e5')
    setError('')
    setIsModalOpen(false)
    loadProjects()
  }

  const colorOptions = [
    '#4f46e5', // Indigo
    '#0891b2', // Cyan
    '#059669', // Emerald
    '#d97706', // Amber
    '#dc2626', // Red
    '#7c3aed', // Violet
  ]

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize your AI workflows, agent pipelines, and deployment environments into projects.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-lg">
          <FolderKanban className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No projects yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Group workflows together by department, client, or product capability.
          </p>
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Create Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Group related workflows, pipelines, and agent tools together."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Name *"
            placeholder="e.g., Financial Modeling, Support Bots"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            error={error}
            autoFocus
          />

          <Textarea
            label="Description"
            placeholder="What is the objective or scope of this project?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">Project Color</label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color === c ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<FolderPlus className="w-3.5 h-3.5" />}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
