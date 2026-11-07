import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    neutral: 'bg-[#F0F0F0] text-[#161616] border-black/5',
    accent: 'bg-[#FFBCCA] text-[#212121] border-[#FF91AC]/40 font-bold',
    success: 'bg-[#e6f7ef] text-[#059669] border-[#10b981]/20',
    warning: 'bg-[#fef3c7] text-[#d97706] border-[#f59e0b]/20',
    danger: 'bg-[#fee2e2] text-[#dc2626] border-[#ef4444]/20',
    info: 'bg-[#e0f2fe] text-[#0284c7] border-[#0ea5e9]/20',
  }

  const dotColors = {
    neutral: 'bg-[#8F8F8F]',
    accent: 'bg-[#FF91AC]',
    success: 'bg-[#10b981]',
    warning: 'bg-[#f59e0b]',
    danger: 'bg-[#ef4444]',
    info: 'bg-[#0284c7]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
}
