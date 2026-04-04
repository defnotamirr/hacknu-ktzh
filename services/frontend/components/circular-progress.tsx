"use client"

import { useEffect, useState } from "react"
import { getHealthColor, getHealthStatus } from "@/lib/health-color"

interface CircularProgressProps {
  value: number
  label: string
  sublabel?: string
  size?: number
  strokeWidth?: number
  delay?: number
}

export function CircularProgress({
  value,
  label,
  sublabel,
  size = 120,
  strokeWidth = 8,
  delay = 0,
}: CircularProgressProps) {
  const [mounted, setMounted] = useState(false)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => setDisplayValue(value), 100)
      return () => clearTimeout(timer)
    }
  }, [mounted, value])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayValue / 100) * circumference
  
  // Get health-based color
  const healthColor = getHealthColor(displayValue)
  const healthStatus = sublabel || getHealthStatus(displayValue)

  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle with health-based color */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={healthColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${healthColor})`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-2xl font-semibold tabular-nums"
            style={{ color: healthColor }}
          >
            {Math.round(displayValue)}%
          </span>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p 
          className="text-xs mt-0.5"
          style={{ color: healthColor }}
        >
          {healthStatus}
        </p>
      </div>
    </div>
  )
}
