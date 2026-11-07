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
  inputs?: HandleDefinition[]
  outputs?: HandleDefinition[]
  children?: React.ReactNode
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  selected = false,
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-600',
  iconBg = 'bg-indigo-50',
  badge,
  isValid = true,
  validationMessage,
  inputs = [],
  outputs = [],
  children,
}) => {
  return (
    <div
      className={cn(
        'w-64 bg-white rounded-lg border text-left shadow-xs transition-all duration-150 relative select-none font-sans',
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      )}
    >
      {/* Target (Input) Handles */}
      {inputs.map((handle, idx) => {
        // Calculate vertical offset cleanly if multiple handles
        const topOffset = inputs.length === 1 ? '50%' : `${((idx + 1) / (inputs.length + 1)) * 100}%`
        return (
          <div key={handle.id} className="relative">
            <Handle
              type="target"
              position={Position.Left}
              id={handle.id}
              style={{ top: topOffset }}
              className="!w-2.5 !h-2.5 !bg-white !border-2 !border-indigo-600 hover:!scale-125 transition-transform"
            />
            {handle.label && (
              <span
                style={{ top: topOffset }}
                className="absolute left-3 -translate-y-1/2 text-[10px] font-medium text-slate-400 pointer-events-none whitespace-nowrap bg-white/80 px-1 rounded"
              >
                {handle.label}
              </span>
            )}
          </div>
        )
      })}

      {/* Node Header */}
      <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50 rounded-t-lg">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={cn('w-6 h-6 rounded flex items-center justify-center shrink-0', iconBg, iconColor)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-800 truncate leading-snug">{title}</h4>
            {subtitle && <p className="text-[10px] text-slate-400 truncate leading-tight">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isValid && (
            <span title={validationMessage || 'Configuration incomplete'}>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            </span>
          )}
          {badge && (
            <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Node Body Content */}
      {children && <div className="p-3 text-xs text-slate-600 space-y-2">{children}</div>}

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
              className="!w-2.5 !h-2.5 !bg-white !border-2 !border-indigo-600 hover:!scale-125 transition-transform"
            />
            {handle.label && (
              <span
                style={{ top: topOffset }}
                className="absolute right-3 -translate-y-1/2 text-[10px] font-medium text-slate-400 pointer-events-none whitespace-nowrap bg-white/80 px-1 rounded"
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

