"use client"

import { useMemo } from "react"
import { LocomotiveVisual } from "@/components/locomotive-visual"
import { TelemetryCallout } from "@/components/telemetry-callout"
import { MetricCard } from "@/components/metric-card"
import { CircularProgress } from "@/components/circular-progress"
import { TelemetryChart } from "@/components/telemetry-chart"
import { StatusBar } from "@/components/status-bar"
import { Gauge, Thermometer, Zap, Fuel, Activity, Wind } from "lucide-react"

// Generate mock telemetry data
function generateChartData(baseValue: number, variance: number) {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 5}s`,
    value: Math.round(baseValue + (Math.random() - 0.5) * variance),
  }))
}

export default function Dashboard() {
  // Mock telemetry data
  const telemetryData = useMemo(
    () => ({
      speed: 142,
      brakePressure: 6.2,
      wheelPressure: 8.4,
      engineTemp: 87,
      voltage: 3200,
      fuelLevel: 78,
      healthIndex: 94,
      efficiency: 89,
    }),
    []
  )

  // Component health values for the locomotive
  const componentHealth = useMemo(
    () => ({
      wheels: 92,
      engine: 65,
      brakes: 78,
      electrical: 95,
      hydraulics: 85,
      cooling: 72,
    }),
    []
  )

  const chartData = useMemo(
    () => ({
      speed: generateChartData(140, 20),
      temperature: generateChartData(85, 10),
      pressure: generateChartData(6.5, 1.5),
      fuel: generateChartData(80, 5),
    }),
    []
  )

  const statusItems = [
    { label: "Connection", value: "Established", status: "online" as const },
    { label: "Latency", value: "24ms", status: "online" as const },
    { label: "Mode", value: "Autonomous" },
    { label: "Route", value: "SEA → PDX" },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border/50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-foreground/70" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground tracking-tight">
                  LocoTwin
                </h1>
                <p className="text-xs text-muted-foreground">
                  Digital Twin Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/30">
                <span className="text-xs text-muted-foreground">Unit ID:</span>
                <span className="text-sm font-mono font-medium text-foreground">
                  LT-2847
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pastel-green/10 border border-pastel-green/20">
                <div className="w-2 h-2 rounded-full bg-pastel-green animate-pulse" />
                <span className="text-xs font-medium text-pastel-green">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Section - Locomotive Visualization */}
            <div className="col-span-8 relative">
              {/* Hero Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-foreground tracking-tight text-balance">
                  Real-Time Telemetry
                </h2>
                <p className="text-muted-foreground mt-1">
                  Live monitoring and diagnostics for locomotive LT-2847
                </p>
              </div>

              {/* Locomotive with Callouts */}
              <div className="relative py-12">
                <LocomotiveVisual componentHealth={componentHealth} />
                
                {/* Telemetry Callouts */}
                <TelemetryCallout
                  label="Speed"
                  value={telemetryData.speed.toString()}
                  unit="km/h"
                  position={{ top: "5%", left: "10%" }}
                  lineDirection="bottom"
                  delay={200}
                />
                
                <TelemetryCallout
                  label="Brake Pressure"
                  value={telemetryData.brakePressure.toFixed(1)}
                  unit="bar"
                  position={{ top: "20%", right: "25%" }}
                  lineDirection="left"
                  delay={400}
                />
                
                <TelemetryCallout
                  label="Engine Temp"
                  value={telemetryData.engineTemp.toString()}
                  unit="°C"
                  position={{ bottom: "30%", left: "5%" }}
                  lineDirection="right"
                  delay={600}
                />
                
                <TelemetryCallout
                  label="Voltage"
                  value={telemetryData.voltage.toString()}
                  unit="V"
                  position={{ bottom: "25%", right: "10%" }}
                  lineDirection="left"
                  delay={800}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <TelemetryChart
                  title="Speed Over Time"
                  data={chartData.speed}
                  unit="km/h"
                  healthValue={92}
                  delay={1000}
                />
                <TelemetryChart
                  title="Engine Temperature"
                  data={chartData.temperature}
                  unit="°C"
                  healthValue={componentHealth.cooling}
                  delay={1100}
                />
                <TelemetryChart
                  title="Brake Pressure"
                  data={chartData.pressure}
                  unit="bar"
                  healthValue={componentHealth.brakes}
                  delay={1200}
                />
                <TelemetryChart
                  title="Fuel Level"
                  data={chartData.fuel}
                  unit="%"
                  healthValue={telemetryData.fuelLevel}
                  delay={1300}
                />
              </div>
            </div>

            {/* Right Section - Metrics Panel */}
            <div className="col-span-4 space-y-6">
              {/* Key Metrics Header */}
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Key Metrics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Primary system indicators
                </p>
              </div>

              {/* Circular Progress Indicators */}
              <div className="bg-glass backdrop-blur-xl border border-glass-border rounded-2xl p-6 shadow-lg">
                <div className="flex justify-around">
                  <CircularProgress
                    value={telemetryData.healthIndex}
                    label="Health Index"
                    delay={300}
                  />
                  <CircularProgress
                    value={telemetryData.efficiency}
                    label="Efficiency"
                    delay={500}
                  />
                </div>
              </div>

              {/* Metric Cards */}
              <MetricCard
                label="Current Speed"
                value={telemetryData.speed.toString()}
                unit="km/h"
                icon={<Gauge className="w-4 h-4" />}
                delay={400}
              />
              
              <MetricCard
                label="Fuel Level"
                value={telemetryData.fuelLevel.toString()}
                unit="%"
                progress={telemetryData.fuelLevel}
                icon={<Fuel className="w-4 h-4" />}
                delay={500}
              />
              
              <MetricCard
                label="Engine Temperature"
                value={telemetryData.engineTemp.toString()}
                unit="°C"
                progress={100 - (telemetryData.engineTemp / 120) * 100 + 30}
                icon={<Thermometer className="w-4 h-4" />}
                delay={600}
              />
              
              <MetricCard
                label="System Voltage"
                value={(telemetryData.voltage / 1000).toFixed(1)}
                unit="kV"
                progress={95}
                icon={<Zap className="w-4 h-4" />}
                delay={700}
              />
              
              <MetricCard
                label="Brake Pressure"
                value={telemetryData.brakePressure.toFixed(1)}
                unit="bar"
                progress={componentHealth.brakes}
                icon={<Wind className="w-4 h-4" />}
                delay={800}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <StatusBar items={statusItems} />
    </div>
  )
}
