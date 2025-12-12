import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:shadow-glow-cyan hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-red-500 to-neon-pink text-white hover:shadow-glow-pink hover:-translate-y-0.5",
        outline:
          "border border-border bg-surface hover:bg-surface-elevated hover:border-neon-cyan text-text-primary",
        secondary:
          "bg-surface-elevated border border-border text-text-primary hover:bg-background-hover hover:border-neon-cyan",
        ghost: "text-text-secondary hover:bg-surface hover:text-text-primary",
        link: "text-neon-cyan underline-offset-4 hover:underline hover:text-accent-hover",
        premium: "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white shadow-glow-cyan hover:shadow-glow-purple hover:-translate-y-0.5 animate-gradient-x bg-[length:200%_200%]",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }