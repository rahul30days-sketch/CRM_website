import * as React from 'react'
import { cn } from '@/lib/utils'

const inputStyles =
  'w-full rounded-chip border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/50 shadow-sm transition-colors focus-visible:border-brand focus-visible:outline-none'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputStyles, className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(inputStyles, 'min-h-28', className)} {...props} />
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn(inputStyles, 'appearance-none', className)} {...props} />
))
Select.displayName = 'Select'

export function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-due"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-due" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
