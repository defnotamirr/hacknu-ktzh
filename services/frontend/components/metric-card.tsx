"use client"

import { useEffect, useState } from "react"
import { getHealthColor } from "@/lib/health-color"

interface MetricCardProps {
  label: string
  value: string
  unit: string
  progress?: number
  icon?: React.ReactNode
  delay?: number
}

export function MetricCard({
  label,
  value,
  unit,
  progress,
  icon,
  delay = 0,
}: MetricCardProps) {
  const [mounted, setMounted] = useState(false)
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (mounted && progress !== undefined) {
      const timer = setTimeout(() => setDisplayProgress(progress), 100)
      return () => clearTimeout(timer)
    }
  }, [mounted, progress])

  // Get health-based color for progress bar
  const healthColor = progress !== undefined ? getHealthColor(progress) : undefined

  return (
    <div
      className={`bg-glass backdrop-blur-xl border border-glass-border rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 group ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider group-hover:text-foreground/70 transition-colors">
          {label}
        </p>
        {icon && (
          <div 
            className="transition-colors"
            style={{ color: healthColor || 'var(--muted-foreground)' }}
          >
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-semibold text-foreground tabular-nums leading-none">
          {value}
        </span>
        <span className="text-sm text-muted-foreground pb-0.5">
          {unit}
        </span>
      </div>
      
      {progress !== undefined && (
        <div className="relative">
          <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${displayProgress}%`,
                backgroundColor: healthColor,
                boxShadow: `0 0 8px ${healthColor}`,
              }}
            />
          </div>
          <span 
            className="absolute -top-5 right-0 text-xs"
            style={{ color: healthColor }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}
