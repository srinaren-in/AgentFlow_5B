import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono uppercase tracking-wider transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none rounded-full cursor-pointer'

    const sizeStyles = {
      sm: 'text-[11px] font-semibold px-3 py-1.5 gap-1.5 h-8',
      md: 'text-xs font-semibold px-4 py-2 gap-2 h-9',
      lg: 'text-sm font-semibold px-6 py-2.5 gap-2.5 h-10',
    }

    const variantStyles = {
      primary:
        'bg-[#FFBCCA] text-[#212121] hover:bg-[#FF91AC] active:bg-[#ff809f] focus:ring-[#FF91AC] shadow-xs border border-black/5 hover:-translate-y-0.5',
      secondary:
        'bg-white text-[#161616] hover:bg-[#F0F0F0] border border-[#D9D9D9] active:bg-[#e5e5e5] focus:ring-[#8F8F8F] shadow-xs',
      outline:
        'bg-transparent text-[#161616] hover:bg-[#F0F0F0] border border-[#D9D9D9] focus:ring-[#8F8F8F]',
      ghost:
        'bg-transparent text-[#161616] hover:bg-[#F0F0F0] focus:ring-[#8F8F8F] border border-transparent',
      danger:
        'bg-[#212121] text-rose-400 hover:text-rose-300 hover:bg-[#161616] active:bg-black focus:ring-rose-500 shadow-xs border border-rose-900/30',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
