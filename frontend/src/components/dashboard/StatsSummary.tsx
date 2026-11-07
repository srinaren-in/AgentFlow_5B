import React from 'react'
import { Workflow, Project, ModelProvider } from '@/types'
import { Card } from '@/components/common/Card'
import { Workflow as WorkflowIcon, CheckCircle2, Cpu, FolderGit2 } from 'lucide-react'

interface StatsSummaryProps {
  workflows: Workflow[]
  projects: Project[]
  providers: ModelProvider[]
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ workflows, projects, providers }) => {
  const activeCount = workflows.filter((w) => w.status === 'active').length
  const configuredProviders = providers.filter((p) => p.isConfigured).length

  const stats = [
    {
      label: 'Total Workflows',
      value: workflows.length,
      subtext: `${workflows.filter((w) => w.status === 'draft').length} draft`,
      icon: WorkflowIcon,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
    },
    {
      label: 'Active Pipelines',
      value: activeCount,
      subtext: `${Math.round((activeCount / (workflows.length || 1)) * 100)}% deployed`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Model Providers',
      value: configuredProviders,
      subtext: `${providers.length - configuredProviders} unconfigured`,
      icon: Cpu,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
    },
    {
      label: 'Projects',
      value: projects.length,
      subtext: 'Grouped pipelines',
      icon: FolderGit2,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
              <span className="text-xs text-slate-500">{stat.subtext}</span>
            </div>
            <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
