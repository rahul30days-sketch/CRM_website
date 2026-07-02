import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Primary CTA is ink/near-black — the most-clickable object on a light-blue
 * field. Brand blue is reserved for links, active nav and focus rings.
 * Secondary is white glass with a hairline border. Buttons lift softly on
 * hover and press down on active.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-chip text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[rgb(var(--btn-ink))] text-white shadow-soft hover:-translate-y-0.5 hover:shadow-glass active:translate-y-0 active:shadow-press',
        secondary:
          'border border-line bg-white/80 text-ink shadow-soft backdrop-blur hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand active:translate-y-0',
        brand:
          'bg-brand text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-hi active:translate-y-0 active:shadow-press',
        ghost: 'text-slate hover:bg-sky hover:text-ink',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-5',
        lg: 'h-13 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
