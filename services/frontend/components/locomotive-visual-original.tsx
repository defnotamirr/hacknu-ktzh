"use client"

import { useEffect, useState } from "react"
import { getHealthColor } from "@/lib/health-color"

interface ComponentHealth {
  wheels: number
  engine: number
  brakes: number
  electrical: number
  hydraulics: number
  cooling: number
}

interface LocomotiveVisualProps {
  componentHealth?: ComponentHealth
}

export function LocomotiveVisual({ 
  componentHealth = {
    wheels: 92,
    engine: 65,
    brakes: 78,
    electrical: 95,
    hydraulics: 85,
    cooling: 72,
  }
}: LocomotiveVisualProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get colors for each component based on health
  const colors = {
    wheels: getHealthColor(componentHealth.wheels),
    engine: getHealthColor(componentHealth.engine),
    brakes: getHealthColor(componentHealth.brakes),
    electrical: getHealthColor(componentHealth.electrical),
    hydraulics: getHealthColor(componentHealth.hydraulics),
    cooling: getHealthColor(componentHealth.cooling),
  }

  return (
    <div className={`relative transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      {/* Glow effect underneath - on the rails */}
      <div 
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[90%] h-6 blur-xl rounded-full"
        style={{ backgroundColor: `${colors.wheels}`, opacity: 0.3 }}
      />
      
      {/* Locomotive SVG - 3D perspective side view */}
      <svg
        viewBox="0 0 900 380"
        className="w-full h-auto"
        style={{ filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4))" }}
      >
        <defs>
          {/* Glass outer shell gradient */}
          <linearGradient id="glassShell" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(180, 190, 200, 0.6)" />
            <stop offset="30%" stopColor="rgba(150, 160, 175, 0.4)" />
            <stop offset="70%" stopColor="rgba(130, 140, 155, 0.35)" />
            <stop offset="100%" stopColor="rgba(120, 130, 145, 0.5)" />
          </linearGradient>
          
          {/* Glass highlight */}
          <linearGradient id="glassHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          
          {/* Rail gradient */}
          <linearGradient id="railGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(100, 110, 125, 0.9)" />
            <stop offset="100%" stopColor="rgba(70, 80, 95, 0.95)" />
          </linearGradient>
          
          {/* Wheel metallic gradient */}
          <radialGradient id="wheelMetal" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(200, 210, 220, 0.9)" />
            <stop offset="50%" stopColor="rgba(120, 130, 145, 0.95)" />
            <stop offset="100%" stopColor="rgba(80, 90, 105, 1)" />
          </radialGradient>
          
          {/* Component glow filter */}
          <filter id="componentGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Stronger glow for wheels */}
          <filter id="wheelGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Subtle inner shadow */}
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0" />
            <feBlend in2="SourceGraphic" mode="normal" />
          </filter>
        </defs>
        
        {/* ==================== RAILS ==================== */}
        <g>
          {/* Rail base / ground plane */}
          <rect x="20" y="335" width="860" height="8" rx="2" fill="url(#railGradient)" />
          <rect x="20" y="345" width="860" height="4" rx="1" fill="rgba(60, 70, 85, 0.8)" />
          
          {/* Rail ties */}
          {[60, 140, 220, 300, 380, 460, 540, 620, 700, 780].map((x, i) => (
            <rect key={i} x={x} y="350" width="40" height="6" rx="1" fill="rgba(80, 90, 105, 0.6)" />
          ))}
          
          {/* Rail glow reflection */}
          <rect 
            x="20" y="332" width="860" height="3" rx="1" 
            fill={colors.wheels} 
            fillOpacity="0.15"
          />
        </g>
        
        {/* ==================== MAIN LOCOMOTIVE BODY ==================== */}
        <g filter="url(#innerShadow)">
          {/* Undercarriage / chassis */}
          <rect x="80" y="280" width="720" height="35" rx="4" fill="rgba(50, 55, 65, 0.95)" />
          
          {/* Main body - glass shell with 3D perspective */}
          <path
            d="M 100 280 
               L 100 120 
               Q 100 100, 120 95 
               L 180 85 
               Q 200 80, 220 80 
               L 750 80 
               Q 780 80, 790 95 
               L 800 120 
               L 800 280 
               Z"
            fill="url(#glassShell)"
            stroke="rgba(200, 210, 220, 0.3)"
            strokeWidth="1.5"
          />
          
          {/* Cab section - front */}
          <path
            d="M 100 280 
               L 100 140 
               Q 100 120, 110 110 
               L 150 90 
               Q 165 85, 180 85 
               L 230 85 
               L 230 280 
               Z"
            fill="url(#glassShell)"
            stroke="rgba(200, 210, 220, 0.25)"
            strokeWidth="1"
          />
          
          {/* Top highlight reflection */}
          <path
            d="M 120 95 
               Q 140 85, 180 82 
               L 750 82 
               Q 775 82, 785 92 
               L 785 100 
               L 180 100 
               Q 150 100, 130 105 
               Z"
            fill="url(#glassHighlight)"
          />
          
          {/* Cab windows */}
          <rect x="115" y="110" width="45" height="55" rx="6" fill="rgba(70, 85, 110, 0.5)" stroke="rgba(150, 165, 185, 0.3)" strokeWidth="1" />
          <rect x="170" y="110" width="50" height="55" rx="6" fill="rgba(70, 85, 110, 0.5)" stroke="rgba(150, 165, 185, 0.3)" strokeWidth="1" />
          
          {/* Front windshield angled */}
          <path
            d="M 105 145 L 110 115 Q 112 108, 118 105 L 140 95 L 145 95 L 145 145 Z"
            fill="rgba(80, 95, 120, 0.5)"
            stroke="rgba(150, 165, 185, 0.3)"
            strokeWidth="1"
          />
        </g>
        
        {/* ==================== ELECTRICAL SYSTEM - Front (Yellow) ==================== */}
        <g filter="url(#componentGlow)">
          {/* Main electrical housing */}
          <rect
            x="120"
            y="185"
            width="95"
            height="75"
            rx="6"
            fill={colors.electrical}
            fillOpacity="0.35"
            stroke={colors.electrical}
            strokeWidth="2"
            strokeOpacity="0.8"
          />
          
          {/* Electrical details - circuit patterns */}
          <path
            d="M 135 200 L 150 200 L 150 215 L 165 215 L 165 200 L 180 200"
            fill="none"
            stroke={colors.electrical}
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          <path
            d="M 135 235 L 155 235 L 155 245 L 175 245"
            fill="none"
            stroke={colors.electrical}
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          <circle cx="145" cy="200" r="4" fill={colors.electrical} fillOpacity="0.5" />
          <circle cx="175" cy="200" r="4" fill={colors.electrical} fillOpacity="0.5" />
          <circle cx="200" cy="220" r="5" fill={colors.electrical} fillOpacity="0.6" />
          
          {/* Wiring harness */}
          <path
            d="M 215 195 Q 230 195, 240 200 L 250 205"
            fill="none"
            stroke={colors.electrical}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <path
            d="M 215 220 Q 235 225, 250 225"
            fill="none"
            stroke={colors.electrical}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        </g>
        
        {/* ==================== ENGINE BLOCK - Center (Pink/Salmon based on health) ==================== */}
        <g filter="url(#componentGlow)">
          {/* Main engine housing */}
          <rect
            x="280"
            y="105"
            width="280"
            height="130"
            rx="8"
            fill={colors.engine}
            fillOpacity="0.3"
            stroke={colors.engine}
            strokeWidth="2"
            strokeOpacity="0.7"
          />
          
          {/* Engine core */}
          <rect
            x="300"
            y="120"
            width="140"
            height="90"
            rx="6"
            fill={colors.engine}
            fillOpacity="0.45"
            stroke={colors.engine}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          
          {/* Engine cylinders */}
          {[320, 360, 400].map((x, i) => (
            <g key={i}>
              <rect
                x={x}
                y="130"
                width="25"
                height="70"
                rx="4"
                fill={colors.engine}
                fillOpacity="0.55"
                stroke={colors.engine}
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <rect
                x={x + 5}
                y="135"
                width="15"
                height="25"
                rx="2"
                fill={colors.engine}
                fillOpacity="0.7"
              />
            </g>
          ))}
          
          {/* Turbo/intake manifold */}
          <ellipse
            cx="490"
            cy="160"
            rx="45"
            ry="35"
            fill={colors.engine}
            fillOpacity="0.4"
            stroke={colors.engine}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <ellipse
            cx="490"
            cy="160"
            rx="25"
            ry="20"
            fill={colors.engine}
            fillOpacity="0.6"
          />
          
          {/* Exhaust pipes */}
          <path
            d="M 510 140 Q 530 130, 540 115 L 545 100"
            fill="none"
            stroke={colors.engine}
            strokeWidth="8"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
          <path
            d="M 350 110 L 350 95 Q 350 85, 360 82 L 380 82"
            fill="none"
            stroke={colors.engine}
            strokeWidth="6"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />
          
          {/* Engine glow effect */}
          <rect
            x="300"
            y="220"
            width="140"
            height="8"
            rx="2"
            fill={colors.engine}
            fillOpacity="0.6"
          />
        </g>
        
        {/* ==================== COOLING SYSTEM ==================== */}
        <g filter="url(#componentGlow)">
          <rect
            x="580"
            y="115"
            width="80"
            height="65"
            rx="6"
            fill={colors.cooling}
            fillOpacity="0.3"
            stroke={colors.cooling}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          {/* Cooling fins */}
          {[590, 605, 620, 635, 650].map((x, i) => (
            <rect
              key={i}
              x={x}
              y="125"
              width="6"
              height="45"
              rx="1"
              fill={colors.cooling}
              fillOpacity="0.5"
            />
          ))}
        </g>
        
        {/* ==================== HYDRAULICS SYSTEM - Under body (Purple/Blue) ==================== */}
        <g filter="url(#componentGlow)">
          {/* Main hydraulic cylinder */}
          <rect
            x="280"
            y="250"
            width="200"
            height="25"
            rx="12"
            fill={colors.hydraulics}
            fillOpacity="0.5"
            stroke={colors.hydraulics}
            strokeWidth="2"
            strokeOpacity="0.7"
          />
          
          {/* Hydraulic pump */}
          <circle
            cx="510"
            cy="262"
            r="18"
            fill={colors.hydraulics}
            fillOpacity="0.45"
            stroke={colors.hydraulics}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <circle
            cx="510"
            cy="262"
            r="8"
            fill={colors.hydraulics}
            fillOpacity="0.7"
          />
          
          {/* Hydraulic lines */}
          <path
            d="M 480 252 L 480 240 Q 480 235, 475 235 L 445 235"
            fill="none"
            stroke={colors.hydraulics}
            strokeWidth="4"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          <path
            d="M 530 255 L 560 255 Q 570 255, 575 260 L 580 270"
            fill="none"
            stroke={colors.hydraulics}
            strokeWidth="4"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
        </g>
        
        {/* ==================== BRAKE SYSTEM ==================== */}
        <g filter="url(#componentGlow)">
          <rect
            x="680"
            y="190"
            width="90"
            height="55"
            rx="6"
            fill={colors.brakes}
            fillOpacity="0.3"
            stroke={colors.brakes}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          {/* Brake discs visualization */}
          <circle cx="705" cy="217" r="12" fill={colors.brakes} fillOpacity="0.5" stroke={colors.brakes} strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="745" cy="217" r="12" fill={colors.brakes} fillOpacity="0.5" stroke={colors.brakes} strokeWidth="1" strokeOpacity="0.4" />
        </g>
        
        {/* ==================== WHEELS with GLOWING RINGS ==================== */}
        {[150, 250, 420, 540, 660, 760].map((cx, i) => (
          <g key={i} filter="url(#wheelGlow)">
            {/* Wheel glow ring - outer */}
            <circle
              cx={cx}
              cy="310"
              r="38"
              fill="none"
              stroke={colors.wheels}
              strokeWidth="4"
              strokeOpacity="0.6"
            />
            
            {/* Wheel glow ring - inner accent */}
            <circle
              cx={cx}
              cy="310"
              r="32"
              fill="none"
              stroke={colors.wheels}
              strokeWidth="2"
              strokeOpacity="0.4"
            />
            
            {/* Main wheel body */}
            <circle
              cx={cx}
              cy="310"
              r="28"
              fill="url(#wheelMetal)"
            />
            
            {/* Wheel inner ring */}
            <circle
              cx={cx}
              cy="310"
              r="20"
              fill="none"
              stroke="rgba(160, 170, 185, 0.5)"
              strokeWidth="2"
            />
            
            {/* Wheel center hub */}
            <circle
              cx={cx}
              cy="310"
              r="10"
              fill="rgba(90, 100, 115, 0.9)"
              stroke={colors.wheels}
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            
            {/* Wheel center detail */}
            <circle
              cx={cx}
              cy="310"
              r="4"
              fill={colors.wheels}
              fillOpacity="0.8"
            />
            
            {/* Wheel spokes */}
            {[0, 45, 90, 135].map((angle) => (
              <line
                key={angle}
                x1={cx + Math.cos((angle * Math.PI) / 180) * 12}
                y1={310 + Math.sin((angle * Math.PI) / 180) * 12}
                x2={cx + Math.cos((angle * Math.PI) / 180) * 24}
                y2={310 + Math.sin((angle * Math.PI) / 180) * 24}
                stroke="rgba(140, 150, 165, 0.6)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
            
            {/* Bottom glow on rail */}
            <ellipse
              cx={cx}
              cy="345"
              rx="30"
              ry="6"
              fill={colors.wheels}
              fillOpacity="0.2"
            />
          </g>
        ))}
        
        {/* ==================== ADDITIONAL DETAILS ==================== */}
        {/* Roof vents */}
        <rect x="400" y="75" width="120" height="10" rx="3" fill="rgba(100, 110, 125, 0.6)" />
        <rect x="550" y="75" width="80" height="10" rx="3" fill="rgba(100, 110, 125, 0.5)" />
        
        {/* Exhaust stacks */}
        <rect x="420" y="60" width="20" height="15" rx="4" fill="rgba(80, 90, 105, 0.7)" />
        <rect x="540" y="65" width="16" height="10" rx="3" fill="rgba(80, 90, 105, 0.6)" />
        
        {/* Front headlight */}
        <ellipse cx="108" cy="195" rx="8" ry="12" fill="rgba(255, 250, 230, 0.9)" />
        <ellipse cx="108" cy="195" rx="5" ry="8" fill="rgba(255, 255, 245, 0.95)" />
        
        {/* Rear coupling */}
        <rect x="800" y="240" width="25" height="30" rx="4" fill="rgba(70, 80, 95, 0.8)" />
        
        {/* ID plate on cab */}
        <rect x="125" y="175" width="70" height="22" rx="3" fill="rgba(35, 40, 50, 0.9)" stroke="rgba(100, 110, 125, 0.3)" strokeWidth="1" />
        <text x="160" y="191" textAnchor="middle" fontSize="12" fontWeight="600" fill="rgba(200, 210, 225, 0.9)" fontFamily="system-ui">
          LT-2847
        </text>
      </svg>
      
      {/* Ground reflection gradient */}
      <div className="absolute -bottom-6 left-0 right-0 h-8 bg-gradient-to-b from-foreground/5 to-transparent" />
    </div>
  )
}
