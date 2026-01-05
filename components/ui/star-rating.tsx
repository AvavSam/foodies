'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  label?: string
  className?: string
  disabled?: boolean
}

export function StarRating({ value, onChange, label, className, disabled = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-sm font-medium text-foreground">{label}</Label>}
      <div
        className="flex gap-1 p-3 bg-secondary/50 rounded-xl w-fit"
        onMouseLeave={() => !disabled && setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHoverValue(star)}
            disabled={disabled}
            className={cn(
              "focus:outline-none transition-all p-0.5 rounded",
              !disabled && "hover:scale-125 cursor-pointer",
              disabled && "cursor-default"
            )}
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                star <= (hoverValue || value)
                  ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
