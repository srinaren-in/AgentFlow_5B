import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Workflow } from '@/types'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { formatDate } from '@/lib/utils'
import { GitBranch, Layers, Clock, ArrowRight, Trash2 } from 'lucide-react'

interface WorkflowCardProps {
  workflow: Workflow
  onDelete?: (id: string) => void
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onDelete }) => {
  const navigate = useNavigate()

  const getStatusBadge = () => {
    switch (workflow.status) {
      case 'active':
        return <Badge variant="success" dot>Active</Badge>
      case 'running':
        return <Badge variant="info" dot>Running</Badge>
      case 'error':
        return <Badge variant="danger" dot>Error</Badge>
      case 'draft':
      default:
        return <Badge variant="neutral" dot>Draft</Badge>
    }
  }

  return (
    <Card className="group relative flex flex-col justify-between hover:border-slate-300 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="space-y-1">
            <h3
              onClick={() => navigate(`/editor/${workflow.id}`)}
              className="text-sm font-semibold text-[#161616] group-hover:text-[#FF91AC] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {workflow.name}
            </h3>
            {workflow.projectName && (
              <span className="text-[10px] font-mono uppercase text-[#161616] bg-[#FFE4E9] px-2 py-0.5 rounded-full border border-black/5">
                {workflow.projectName}
              </span>
            )}
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {workflow.description || 'No description provided.'}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {workflow.tags.map(tag => (
            <span
              key={tag}
              className="inline-block px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title="Nodes in workflow">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {workflow.nodeCount} nodes
          </span>
          <span className="flex items-center gap-1" title="Connections">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            {workflow.edgeCount} edges
          </span>
          <span className="flex items-center gap-1 text-slate-400" title="Last updated">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(workflow.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete workflow "${workflow.name}"?`)) {
                  onDelete(workflow.id)
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
              title="Delete Workflow"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => navigate(`/editor/${workflow.id}`)}
            className="inline-flex items-center gap-1 text-xs font-mono uppercase text-[#303030] hover:text-[#FF91AC] px-2.5 py-1 rounded-full hover:bg-[#FFE4E9] transition-colors"
          >
            <span>Open</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </Card>
  )
}

