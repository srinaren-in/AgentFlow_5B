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
  const [color, setColor] = useState('#FF91AC')
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
    setColor('#FF91AC')
    setError('')
    setIsModalOpen(false)
    loadProjects()
  }

  const colorOptions = [
    '#FF91AC', // Highlight Accent
    '#212121', // Dark Neutral
    '#059669', // Emerald
    '#d97706', // Amber
    '#2563eb', // Blue
    '#7c3aed', // Violet
  ]

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#161616] tracking-tight">Projects</h1>
          <p className="text-xs text-[#8F8F8F] font-mono mt-0.5">
            Organize AI workflows by department, product, or microservice.
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
        <div className="p-12 text-center bg-white border border-dashed border-[#F8CDD6] rounded-[24px]">
          <FolderKanban className="w-8 h-8 text-[#8F8F8F] mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[#161616]">No projects yet</h3>
          <p className="text-xs text-[#8F8F8F] mt-1 max-w-sm mx-auto">
            Group workflows together to share environment contexts and credentials.
          </p>
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Create Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Group your agent workflows into organized workspaces."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. Autonomous Customer Support"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error}
            autoFocus
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Describe what these agents and pipelines accomplish..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#161616]">Project Accent Color</label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-black' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#FFE4E9] flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<FolderPlus className="w-3.5 h-3.5" />}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
