"use client"

import { useEffect, useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { getHealthColor } from "@/lib/health-color"

interface TelemetryChartProps {
  title: string
  data: { time: string; value: number }[]
  unit: string
  healthValue?: number // 0-100 to determine color based on health
  delay?: number
}

export function TelemetryChart({
  title,
  data,
  unit,
  healthValue,
  delay = 0,
}: TelemetryChartProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("5min")

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  // Calculate health value from data if not provided
  const calculatedHealth = useMemo(() => {
    if (healthValue !== undefined) return healthValue
    // Use the latest value as a percentage (normalize based on context)
    const latestValue = data[data.length - 1]?.value || 0
    // For speed/temp/pressure, treat as percentage directly if under 100
    // Otherwise normalize
    return Math.min(100, latestValue)
  }, [healthValue, data])

  const chartColor = getHealthColor(calculatedHealth)

  const tabs = ["Live", "5 min", "15 min"]

  return (
    <div
      className={`bg-glass backdrop-blur-xl border border-glass-border rounded-2xl p-5 shadow-lg transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? "bg-foreground/10 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 500 }}
              formatter={(value: number) => [`${value} ${unit}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: chartColor,
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              style={{
                filter: `drop-shadow(0 0 4px ${chartColor})`,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
