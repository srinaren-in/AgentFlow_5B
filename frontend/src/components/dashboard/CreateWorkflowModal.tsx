import React, { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Input, Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Project } from '@/types'

interface CreateWorkflowModalProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  onCreate: (data: { name: string; description: string; projectId?: string; tags: string[] }) => void
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  isOpen,
  onClose,
  projects,
  onCreate,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState<string>('')
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Workflow name is required.')
      return
    }

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    onCreate({
      name,
      description,
      projectId: projectId || undefined,
      tags: tags.length ? tags : ['Agent'],
    })

    // Reset form
    setName('')
    setDescription('')
    setProjectId('')
    setTagInput('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New AI Workflow"
      description="Define the workflow metadata before entering the visual pipeline editor."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Workflow Name *"
          placeholder="e.g., Autonomous Support Agent, Web Scraper & Summarizer"
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
          placeholder="What will this AI workflow or agent accomplish?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Project / Category</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
          >
            <option value="">No Project (Unassigned)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Tags (Comma-separated)"
          placeholder="Ollama, Qwen 2.5, Tools, LangGraph"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          helperText="Helps filter and organize your agents."
        />

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Workflow
          </Button>
        </div>
      </form>
    </Modal>
  )
}

