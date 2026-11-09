import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { LucideIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HandleDefinition {
  id: string
  label: string
  tooltip?: string
  type?: 'source' | 'target'
}

export interface BaseNodeProps {
  selected?: boolean
  title: string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  badge?: string
  isValid?: boolean
  validationMessage?: string
  executionStatus?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  inputs?: HandleDefinition[]
  outputs?: HandleDefinition[]
  children?: React.ReactNode
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  selected = false,
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#212121]',
  iconBg = 'bg-[#FFE4E9]',
  badge,
  isValid = true,
  validationMessage,
  executionStatus,
  inputs = [],
  outputs = [],
  children,
}) => {
  const getExecutionRing = () => {
    if (executionStatus === 'completed') return 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-sm'
    if (executionStatus === 'failed') return 'border-rose-500 ring-2 ring-rose-500/40 shadow-sm'
    if (executionStatus === 'running') return 'border-[#FF91AC] ring-2 ring-[#FFBCCA] animate-pulse shadow-md'
    if (executionStatus === 'skipped') return 'opacity-60 border-slate-300'
    return selected
      ? 'border-[#FF91AC] ring-2 ring-[#FFBCCA]/50 shadow-md'
      : 'border-[#F8CDD6] hover:border-[#F0AEC0] hover:shadow-sm'
  }

  return (
    <div
      className={cn(
        'w-64 bg-white rounded-[20px] border text-left shadow-xs transition-all duration-150 relative select-none font-sans',
        getExecutionRing()
      )}
    >
      {/* Target (Input) Handles */}
      {inputs.map((handle, idx) => {
        const topOffset = inputs.length === 1 ? '50%' : `${((idx + 1) / (inputs.length + 1)) * 100}%`
        return (
          <div key={handle.id} className="relative">
            <Handle
              type="target"
              position={Position.Left}
              id={handle.id}
              style={{ top: topOffset }}
              className="!w-2.5 !h-2.5 !bg-white !border-2 !border-[#FF91AC] hover:!bg-[#FFBCCA] hover:!scale-125 transition-transform"
            />
            {handle.label && (
              <span
                style={{ top: topOffset }}
                className="absolute left-3 -translate-y-1/2 text-[10px] font-mono uppercase tracking-wider text-[#8F8F8F] pointer-events-none whitespace-nowrap bg-white/90 px-1 rounded"
              >
                {handle.label}
              </span>
            )}
          </div>
        )
      })}

      {/* Node Header */}
      <div className="px-3.5 py-3 border-b border-[#FFE4E9] flex items-center justify-between gap-2 bg-[#FFF0F3] rounded-t-[20px]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-black/5', iconBg, iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-[#161616] truncate leading-snug">{title}</h4>
            {subtitle && <p className="text-[10px] text-[#8F8F8F] truncate leading-tight font-mono">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {executionStatus === 'completed' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="Step completed successfully" />
          )}
          {executionStatus === 'failed' && (
            <span className="w-2 h-2 rounded-full bg-rose-500" title="Step execution failed" />
          )}
          {executionStatus === 'running' && (
            <span className="w-2 h-2 rounded-full bg-[#FF91AC] animate-ping" title="Step executing..." />
          )}
          {!isValid && (
            <span title={validationMessage || 'Configuration incomplete'}>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            </span>
          )}
          {badge && (
            <span className="text-[9px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#FFE4E9] text-[#161616] border border-black/5">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Node Body Content */}
      {children && <div className="p-3.5 text-xs text-[#303030] space-y-2">{children}</div>}

      {/* Source (Output) Handles */}
      {outputs.map((handle, idx) => {
        const topOffset = outputs.length === 1 ? '50%' : `${((idx + 1) / (outputs.length + 1)) * 100}%`
        return (
          <div key={handle.id} className="relative">
            <Handle
              type="source"
              position={Position.Right}
              id={handle.id}
              style={{ top: topOffset }}
              className="!w-2.5 !h-2.5 !bg-white !border-2 !border-[#FF91AC] hover:!bg-[#FFBCCA] hover:!scale-125 transition-transform"
            />
            {handle.label && (
              <span
                style={{ top: topOffset }}
                className="absolute right-3 -translate-y-1/2 text-[10px] font-mono uppercase tracking-wider text-[#8F8F8F] pointer-events-none whitespace-nowrap bg-white/90 px-1 rounded"
              >
                {handle.label}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
