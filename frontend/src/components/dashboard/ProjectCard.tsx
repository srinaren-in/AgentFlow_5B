import React from 'react'
import { Project } from '@/types'
import { Card } from '@/components/common/Card'
import { formatDate } from '@/lib/utils'
import { Folder, Workflow as WorkflowIcon, ArrowUpRight } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  onSelect?: (project: Project) => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <Card
      onClick={() => onSelect?.(project)}
      className="p-4 hover:border-slate-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: project.color }}
          >
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#161616] group-hover:text-[#FF91AC] transition-colors">
              {project.name}
            </h4>
            <p className="text-xs text-[#8F8F8F] mt-0.5 line-clamp-1">{project.description}</p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-[#8F8F8F] group-hover:text-[#FF91AC] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium text-slate-600">
          <WorkflowIcon className="w-3.5 h-3.5 text-slate-400" />
          {project.workflowCount} workflows
        </span>
        <span>Updated {formatDate(project.updatedAt)}</span>
      </div>
    </Card>
  )
}

