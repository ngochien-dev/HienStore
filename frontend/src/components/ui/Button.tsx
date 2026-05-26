import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  rounded?: 'md' | 'lg' | 'xl' | 'full'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      rounded = 'xl',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100'

    const roundedStyles = {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full'
    }

    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:bg-indigo-800 focus-visible:ring-indigo-600',
      secondary: 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 active:bg-amber-700 focus-visible:ring-amber-500',
      gradient: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:shadow-indigo-500/25 focus-visible:ring-indigo-600',
      outline: 'border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-400 focus-visible:ring-indigo-600',
      ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700',
      danger: 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20 active:bg-rose-700 focus-visible:ring-rose-500'
    }

    const sizes = {
      sm: 'h-9 px-4 text-xs tracking-wide',
      md: 'h-11 px-6 text-sm tracking-wide',
      lg: 'h-13 px-8 text-base tracking-wide font-semibold'
    }

    const classes = [
      baseStyles,
      roundedStyles[rounded],
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
