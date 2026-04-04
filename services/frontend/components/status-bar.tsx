"use client"

import { useEffect, useState } from "react"

interface StatusItem {
  label: string
  value: string
  status?: "online" | "offline" | "warning"
}

interface StatusBarProps {
  items: StatusItem[]
}

export function StatusBar({ items }: StatusBarProps) {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Static pastel colors to avoid hydration mismatch
  const pastelGreen = "oklch(0.78 0.12 145)"
  const pastelYellow = "oklch(0.85 0.12 90)"
  const pastelRed = "oklch(0.72 0.14 25)"

  const getStatusColor = (status?: "online" | "offline" | "warning") => {
    switch (status) {
      case "online":
        return pastelGreen
      case "offline":
        return pastelRed
      case "warning":
        return pastelYellow
      default:
        return "var(--muted-foreground)"
    }
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-glass/90 backdrop-blur-xl border-t border-glass-border">
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  {item.status && (
                    <span className="relative flex h-2 w-2">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2 w-2"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      />
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Last Update
                </span>
                <span className="text-xs font-mono font-medium text-foreground tabular-nums">
                  {currentTime}
                </span>
              </div>
              
              <div className="h-4 w-px bg-border/50" />
              
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: pastelGreen }}
                />
                <span className="text-xs font-medium text-foreground">
                  Live Monitoring
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
