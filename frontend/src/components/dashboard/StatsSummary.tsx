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
      iconColor: 'text-[#212121]',
      iconBg: 'bg-[#FFBCCA]',
    },
    {
      label: 'Active Pipelines',
      value: activeCount,
      subtext: `${Math.round((activeCount / (workflows.length || 1)) * 100)}% deployed`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Model Providers',
      value: configuredProviders,
      subtext: `${providers.length - configuredProviders} unconfigured`,
      icon: Cpu,
      iconColor: 'text-[#161616]',
      iconBg: 'bg-[#F0F0F0]',
    },
    {
      label: 'Projects',
      value: projects.length,
      subtext: 'Grouped pipelines',
      icon: FolderGit2,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8F8F8F]">
                {stat.label}
              </span>
              <p className="text-2xl font-semibold text-[#161616] tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-[#8F8F8F] font-mono">{stat.subtext}</p>
            </div>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border border-black/5 ${stat.iconBg} ${stat.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
