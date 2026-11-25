import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * The site's one button/CTA style. Use on <button> via <Button>, or on links
 * via `className={buttonVariants({ … })}`.
 *
 * Focus uses the global `:focus-visible` brand outline from globals.css —
 * don't add a ring here, it would hide the shared indicator.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-chip text-sm font-semibold transition-[transform,box-shadow,background-color,border-color,color] duration-fast ease-out disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none',
  {
    variants: {
      variant: {
        /** Highest-emphasis action: Book a demo. One per view. */
        primary:
          'bg-btn-ink text-white shadow-soft hover:-translate-y-0.5 hover:shadow-glass active:translate-y-0 active:shadow-press',
        /** Second action beside a primary. */
        secondary:
          'border border-line bg-white/80 text-ink shadow-soft backdrop-blur hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand active:translate-y-0',
        /** Brand-blue action, for dark or busy surfaces. */
        brand:
          'bg-brand text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-deep active:translate-y-0 active:shadow-press',
        /** Quiet action: nav "Log in", toolbar controls. */
        ghost: 'text-slate hover:bg-sky hover:text-ink',
        /** Light button on night (dark) sections. */
        onNight:
          'border border-white/15 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white/15 active:translate-y-0',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-5',
        lg: 'h-13 px-7 text-base',
        icon: 'h-10 w-10',
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
