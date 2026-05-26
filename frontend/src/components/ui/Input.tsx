import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type, label, error, leftIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-400">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={`
              flex h-11 w-full rounded-xl border bg-white dark:bg-slate-900/50 px-4 py-2 text-sm
              text-slate-800 dark:text-slate-100 placeholder:text-slate-400/80
              transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-indigo-500/10
              disabled:cursor-not-allowed disabled:opacity-50
              ${error 
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' 
                : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/15'
              }
              ${leftIcon ? 'pl-11' : ''}
              ${isPassword ? 'pr-11' : ''}
              ${className}
            `}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-300 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} className="animate-fade-in" />
              ) : (
                <Eye size={18} className="animate-fade-in" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 animate-fade-in">
            <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
