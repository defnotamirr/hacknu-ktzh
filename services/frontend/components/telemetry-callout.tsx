"use client"

import { useEffect, useState } from "react"
import { getHealthColor } from "@/lib/health-color"

interface TelemetryCalloutProps {
  label: string
  value: string
  unit: string
  position: { top?: string; left?: string; right?: string; bottom?: string }
  lineDirection: "left" | "right" | "top" | "bottom"
  healthValue?: number
  delay?: number
}

export function TelemetryCallout({
  label,
  value,
  unit,
  position,
  lineDirection,
  healthValue = 85,
  delay = 0,
}: TelemetryCalloutProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const healthColor = getHealthColor(healthValue)

  const lineStyles: Record<string, string> = {
    left: "right-full top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-l from-border to-transparent mr-2",
    right: "left-full top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-border to-transparent ml-2",
    top: "bottom-full left-1/2 -translate-x-1/2 h-8 w-px bg-gradient-to-t from-border to-transparent mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 h-8 w-px bg-gradient-to-b from-border to-transparent mt-2",
  }

  return (
    <div
      className={`absolute z-10 transition-all duration-700 ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={position}
    >
      {/* Connection line */}
      <div className={`absolute ${lineStyles[lineDirection]}`} />
      
      {/* Dot at connection point with health color */}
      <div
        className={`absolute w-2 h-2 rounded-full ${
          lineDirection === "left" ? "-right-1 top-1/2 -translate-y-1/2" :
          lineDirection === "right" ? "-left-1 top-1/2 -translate-y-1/2" :
          lineDirection === "top" ? "left-1/2 -translate-x-1/2 -bottom-1" :
          "left-1/2 -translate-x-1/2 -top-1"
        }`}
        style={{ backgroundColor: healthColor }}
      >
        <div 
          className="absolute inset-0 rounded-full animate-ping" 
          style={{ backgroundColor: healthColor, opacity: 0.4 }}
        />
      </div>
      
      {/* Card */}
      <div className="bg-glass backdrop-blur-xl border border-glass-border rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-default">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 group-hover:text-foreground/70 transition-colors">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {value}
          </span>
          <span className="text-sm text-muted-foreground">
            {unit}
          </span>
        </div>
      </div>
    </div>
  )
}
