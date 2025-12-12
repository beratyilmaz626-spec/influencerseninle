import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-surface-elevated text-text-primary",
        success:
          "border-neon-green/30 bg-neon-green/10 text-neon-green",
        warning:
          "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
        error:
          "border-neon-pink/30 bg-neon-pink/10 text-neon-pink",
        info:
          "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan",
        outline:
          "border-border text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
