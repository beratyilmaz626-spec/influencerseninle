import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 pr-10 text-sm text-text-primary transition-all duration-300",
            "focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

// Premium Dropdown Component
interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: { id: string; name: string; desc?: string }[]
  placeholder?: string
  className?: string
  isOpen?: boolean
  onToggle?: () => void
}

const PremiumDropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ value, onChange, options, placeholder = "Seçin", className, isOpen, onToggle }, ref) => {
    const selectedOption = options.find(opt => opt.id === value)
    
    return (
      <div ref={ref} className={cn("relative", className)}>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "w-full p-3 rounded-xl border border-border bg-surface text-text-primary transition-all duration-300 text-left flex items-center justify-between",
            "hover:border-neon-cyan/50 hover:bg-surface-elevated",
            "focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan",
            isOpen && "border-neon-cyan shadow-glow-cyan"
          )}
        >
          <span className="text-sm font-medium">
            {selectedOption?.name || placeholder}
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 text-text-secondary transition-transform duration-300",
            isOpen && "rotate-180"
          )} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-elevated overflow-hidden">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id)
                  onToggle?.()
                }}
                className={cn(
                  "w-full p-3 text-left transition-all duration-200 border-b border-border last:border-0",
                  "hover:bg-surface-elevated",
                  value === option.id 
                    ? "bg-neon-cyan/10 text-neon-cyan" 
                    : "text-text-primary"
                )}
              >
                <div className="font-medium text-sm">{option.name}</div>
                {option.desc && (
                  <div className="text-xs text-text-secondary mt-0.5">{option.desc}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
PremiumDropdown.displayName = "PremiumDropdown"

export { Select, PremiumDropdown }
