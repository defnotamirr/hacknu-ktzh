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
      <div 
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[90%] h-6 blur-xl rounded-full"
        style={{ backgroundColor: `${colors.wheels}`, opacity: 0.3 }}
      />
      
      <svg
        viewBox="0 0 900 380"
        className="w-full h-auto"
        style={{ filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4))" }}
      >
        <defs>
          <linearGradient id="glassShell" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(210, 218, 228, 0.65)" />
            <stop offset="25%" stopColor="rgba(185, 195, 210, 0.45)" />
            <stop offset="65%" stopColor="rgba(165, 175, 192, 0.38)" />
            <stop offset="100%" stopColor="rgba(150, 160, 178, 0.55)" />
          </linearGradient>
          <linearGradient id="cabGlass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(200, 210, 225, 0.7)" />
            <stop offset="40%" stopColor="rgba(175, 188, 205, 0.5)" />
            <stop offset="100%" stopColor="rgba(155, 168, 188, 0.6)" />
          </linearGradient>
          <linearGradient id="topHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.38)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <linearGradient id="sideDepth" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(70, 80, 105, 0.22)" />
            <stop offset="12%" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="88%" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="100%" stopColor="rgba(55, 65, 88, 0.18)" />
          </linearGradient>
          <linearGradient id="railGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(110, 120, 135, 0.95)" />
            <stop offset="100%" stopColor="rgba(75, 85, 100, 0.98)" />
          </linearGradient>
          <radialGradient id="wheelMetal" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(215, 222, 232, 0.95)" />
            <stop offset="45%" stopColor="rgba(130, 140, 158, 0.98)" />
            <stop offset="100%" stopColor="rgba(75, 85, 102, 1)" />
          </radialGradient>
          <linearGradient id="undercarriage" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(55, 60, 72, 0.98)" />
            <stop offset="100%" stopColor="rgba(38, 42, 52, 1)" />
          </linearGradient>
          <filter id="componentGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wheelGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.22)" />
          </filter>
        </defs>

        {/* ===== RAILS ===== */}
        <g>
          <rect x="10" y="336" width="880" height="7" rx="2" fill="url(#railGradient)" />
          <rect x="10" y="343" width="880" height="3" rx="1" fill="rgba(55, 65, 80, 0.85)" />
          {[40, 125, 210, 295, 380, 465, 550, 635, 720, 805].map((x, i) => (
            <rect key={i} x={x} y="348" width="45" height="7" rx="1.5" fill="rgba(75, 85, 100, 0.55)" />
          ))}
          <rect x="10" y="334" width="880" height="2.5" rx="1" fill={colors.wheels} fillOpacity="0.12" />
        </g>

        {/* ===== CHASSIS ===== */}
        <rect x="88" y="287" width="710" height="10" rx="2" fill="rgba(45, 50, 62, 0.9)" />
        <rect x="82" y="270" width="722" height="22" rx="3" fill="url(#undercarriage)" />
        <path d="M 95 292 L 88 335 L 808 335 L 800 292 Z" fill="rgba(42, 47, 58, 0.85)" />

        {/* ===== HYDRAULIC / FUEL TANK (purple) ===== */}
        <g filter="url(#componentGlow)">
          <rect
            x="290" y="278" width="310" height="42" rx="8"
            fill={colors.hydraulics} fillOpacity="0.45"
            stroke={colors.hydraulics} strokeWidth="1.8" strokeOpacity="0.75"
          />
          <rect x="295" y="280" width="300" height="8" rx="4" fill={colors.hydraulics} fillOpacity="0.3" />
          <ellipse cx="290" cy="299" rx="8" ry="21" fill={colors.hydraulics} fillOpacity="0.5" stroke={colors.hydraulics} strokeWidth="1" strokeOpacity="0.5" />
          <ellipse cx="600" cy="299" rx="8" ry="21" fill={colors.hydraulics} fillOpacity="0.5" stroke={colors.hydraulics} strokeWidth="1" strokeOpacity="0.5" />
          <ellipse cx="445" cy="326" rx="140" ry="6" fill={colors.hydraulics} fillOpacity="0.18" />
        </g>

        {/* ===== MAIN BODY - GLASS SHELL ===== */}
        <g filter="url(#softShadow)">
          {/* Long hood / main body */}
          <path
            d="M 225 270 L 225 118 Q 225 105 238 100 L 780 100 Q 800 100 808 115 L 808 270 Z"
            fill="url(#glassShell)"
            stroke="rgba(210, 220, 235, 0.35)"
            strokeWidth="1.5"
          />
          <path
            d="M 225 270 L 225 118 Q 225 105 238 100 L 780 100 Q 800 100 808 115 L 808 270 Z"
            fill="url(#sideDepth)"
          />
          {/* Top highlight */}
          <path
            d="M 238 100 L 780 100 Q 798 100 806 112 L 806 118 L 238 108 Q 228 108 226 118 L 226 112 Q 226 102 238 100 Z"
            fill="url(#topHighlight)"
          />
          {/* Cab - short hood front */}
          <path
            d="M 82 270 L 82 148 Q 82 130 95 122 L 145 108 Q 158 105 172 105 L 225 105 L 225 270 Z"
            fill="url(#cabGlass)"
            stroke="rgba(210, 220, 235, 0.3)"
            strokeWidth="1.5"
          />
          {/* Cab top highlight */}
          <path
            d="M 95 122 Q 105 110 145 107 L 172 105 L 225 105 L 225 112 L 172 112 Q 152 112 140 115 Q 110 120 102 130 Z"
            fill="rgba(255,255,255,0.22)"
          />
          {/* Nose */}
          <path
            d="M 70 270 L 70 185 Q 70 175 78 168 L 90 158 L 90 270 Z"
            fill="url(#cabGlass)"
            stroke="rgba(200, 212, 228, 0.25)"
            strokeWidth="1"
          />
        </g>

        {/* ===== CAB WINDOWS ===== */}
        <path
          d="M 76 200 L 82 162 Q 84 155 90 150 L 110 140 L 115 200 Z"
          fill="rgba(65, 80, 108, 0.55)"
          stroke="rgba(160, 175, 200, 0.35)"
          strokeWidth="1.2"
        />
        <path
          d="M 78 198 L 84 162 Q 86 156 91 151 L 108 142 L 108 148 L 93 158 Q 88 163 86 170 L 80 200 Z"
          fill="rgba(255,255,255,0.1)"
        />
        <rect x="130" y="120" width="42" height="50" rx="5" fill="rgba(65, 80, 110, 0.5)" stroke="rgba(160, 175, 200, 0.3)" strokeWidth="1.2" />
        <rect x="178" y="120" width="38" height="50" rx="5" fill="rgba(65, 80, 110, 0.5)" stroke="rgba(160, 175, 200, 0.3)" strokeWidth="1.2" />
        <rect x="133" y="123" width="14" height="20" rx="3" fill="rgba(255,255,255,0.1)" />
        <rect x="181" y="123" width="12" height="18" rx="3" fill="rgba(255,255,255,0.1)" />
        <path
          d="M 155 270 L 155 175 Q 155 170 160 168 L 218 168 L 218 270"
          fill="none" stroke="rgba(180, 192, 210, 0.18)" strokeWidth="1"
        />

        {/* ===== HOOD VENTS ===== */}
        <g opacity="0.6">
          {[245, 260, 275, 290, 305].map((x, i) => (
            <rect key={i} x={x} y="145" width="8" height="90" rx="2" fill="rgba(80, 92, 112, 0.5)" stroke="rgba(140,150,168,0.2)" strokeWidth="0.5" />
          ))}
        </g>
        <g opacity="0.5">
          {[730, 745, 760].map((x, i) => (
            <rect key={i} x={x} y="150" width="8" height="85" rx="2" fill="rgba(80, 92, 112, 0.45)" stroke="rgba(140,150,168,0.2)" strokeWidth="0.5" />
          ))}
        </g>

        {/* ===== ENGINE BLOCK (salmon/pink) ===== */}
        <g filter="url(#componentGlow)">
          <rect x="320" y="108" width="300" height="128" rx="6" fill={colors.engine} fillOpacity="0.12" />
          <rect
            x="335" y="112" width="265" height="118" rx="7"
            fill={colors.engine} fillOpacity="0.28"
            stroke={colors.engine} strokeWidth="2" strokeOpacity="0.65"
          />
          <rect
            x="350" y="122" width="148" height="88" rx="5"
            fill={colors.engine} fillOpacity="0.42"
            stroke={colors.engine} strokeWidth="1.5" strokeOpacity="0.55"
          />
          {[365, 400, 435, 470].map((x, i) => (
            <g key={i}>
              <rect x={x} y="128" width="22" height="72" rx="4" fill={colors.engine} fillOpacity="0.52" stroke={colors.engine} strokeWidth="1" strokeOpacity="0.45" />
              <rect x={x + 3} y="132" width="16" height="22" rx="2.5" fill={colors.engine} fillOpacity="0.68" />
              <rect x={x + 6} y="135" width="10" height="8" rx="1.5" fill={colors.engine} fillOpacity="0.85" />
            </g>
          ))}
          {/* Turbocharger */}
          <ellipse cx="555" cy="158" rx="42" ry="34" fill={colors.engine} fillOpacity="0.38" stroke={colors.engine} strokeWidth="1.5" strokeOpacity="0.6" />
          <ellipse cx="555" cy="158" rx="24" ry="20" fill={colors.engine} fillOpacity="0.58" />
          <ellipse cx="555" cy="158" rx="10" ry="9" fill={colors.engine} fillOpacity="0.82" />
          {[0, 45, 90, 135].map((angle) => (
            <line
              key={angle}
              x1={555 + Math.cos((angle * Math.PI) / 180) * 10}
              y1={158 + Math.sin((angle * Math.PI) / 180) * 10}
              x2={555 + Math.cos((angle * Math.PI) / 180) * 21}
              y2={158 + Math.sin((angle * Math.PI) / 180) * 21}
              stroke={colors.engine} strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round"
            />
          ))}
          {/* Exhaust pipes */}
          <path d="M 520 128 Q 535 118 542 108 L 545 100" fill="none" stroke={colors.engine} strokeWidth="9" strokeOpacity="0.38" strokeLinecap="round" />
          <path d="M 390 122 L 390 108 Q 390 100 398 97 L 418 97" fill="none" stroke={colors.engine} strokeWidth="7" strokeOpacity="0.32" strokeLinecap="round" />
          <rect x="350" y="205" width="148" height="6" rx="3" fill={colors.engine} fillOpacity="0.55" />
        </g>

        {/* ===== COOLING SYSTEM (radiator) ===== */}
        <g filter="url(#componentGlow)">
          <rect
            x="628" y="118" width="88" height="110" rx="6"
            fill={colors.cooling} fillOpacity="0.28"
            stroke={colors.cooling} strokeWidth="1.5" strokeOpacity="0.58"
          />
          {[638, 652, 666, 680, 694, 706].map((x, i) => (
            <rect key={i} x={x} y="126" width="7" height="92" rx="1.5" fill={colors.cooling} fillOpacity="0.48" />
          ))}
          <rect x="630" y="118" width="84" height="10" rx="4" fill={colors.cooling} fillOpacity="0.5" />
        </g>

        {/* ===== ELECTRICAL SYSTEM ===== */}
        <g filter="url(#componentGlow)">
          <rect
            x="105" y="158" width="112" height="88" rx="5"
            fill={colors.electrical} fillOpacity="0.3"
            stroke={colors.electrical} strokeWidth="1.8" strokeOpacity="0.75"
          />
          <path d="M 118 175 L 136 175 L 136 188 L 154 188 L 154 175 L 170 175" fill="none" stroke={colors.electrical} strokeWidth="2" strokeOpacity="0.55" />
          <path d="M 118 205 L 148 205 L 148 218 L 178 218" fill="none" stroke={colors.electrical} strokeWidth="2" strokeOpacity="0.55" />
          <circle cx="128" cy="175" r="4" fill={colors.electrical} fillOpacity="0.5" />
          <circle cx="162" cy="175" r="4" fill={colors.electrical} fillOpacity="0.5" />
          <circle cx="148" cy="205" r="4.5" fill={colors.electrical} fillOpacity="0.6" />
          <circle cx="210" cy="188" r="5" fill={colors.electrical} fillOpacity="0.55" />
          <path d="M 217 180 Q 228 180 235 188 L 242 195" fill="none" stroke={colors.electrical} strokeWidth="2" strokeOpacity="0.4" />
          <path d="M 217 205 Q 232 210 242 210" fill="none" stroke={colors.electrical} strokeWidth="2" strokeOpacity="0.4" />
        </g>

        {/* ===== BRAKE SYSTEM ===== */}
        <g filter="url(#componentGlow)">
          <rect
            x="718" y="185" width="75" height="65" rx="5"
            fill={colors.brakes} fillOpacity="0.28"
            stroke={colors.brakes} strokeWidth="1.5" strokeOpacity="0.58"
          />
          <circle cx="738" cy="217" r="13" fill={colors.brakes} fillOpacity="0.45" stroke={colors.brakes} strokeWidth="1.2" strokeOpacity="0.42" />
          <circle cx="738" cy="217" r="5" fill={colors.brakes} fillOpacity="0.7" />
          <circle cx="773" cy="217" r="13" fill={colors.brakes} fillOpacity="0.45" stroke={colors.brakes} strokeWidth="1.2" strokeOpacity="0.42" />
          <circle cx="773" cy="217" r="5" fill={colors.brakes} fillOpacity="0.7" />
          <path d="M 738 204 L 738 196" stroke={colors.brakes} strokeWidth="3" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M 773 204 L 773 196" stroke={colors.brakes} strokeWidth="3" strokeOpacity="0.5" strokeLinecap="round" />
        </g>

        {/* ===== ROOF DETAILS ===== */}
        <rect x="360" y="95" width="130" height="9" rx="3" fill="rgba(95, 105, 125, 0.65)" />
        <rect x="500" y="95" width="90" height="9" rx="3" fill="rgba(95, 105, 125, 0.55)" />
        <rect x="395" y="75" width="18" height="22" rx="4" fill="rgba(72, 82, 100, 0.8)" />
        <rect x="432" y="80" width="14" height="17" rx="3" fill="rgba(72, 82, 100, 0.7)" />
        <ellipse cx="404" cy="76" rx="10" ry="3" fill="rgba(60, 70, 88, 0.9)" />
        <ellipse cx="439" cy="81" rx="8" ry="2.5" fill="rgba(60, 70, 88, 0.85)" />
        <rect x="165" y="97" width="6" height="12" rx="2" fill="rgba(80, 90, 108, 0.75)" />
        <rect x="158" y="95" width="20" height="4" rx="2" fill="rgba(80, 90, 108, 0.7)" />

        {/* ===== HEADLIGHTS ===== */}
        <ellipse cx="73" cy="195" rx="7" ry="10" fill="rgba(255, 252, 230, 0.92)" />
        <ellipse cx="73" cy="195" rx="4.5" ry="6.5" fill="rgba(255, 255, 248, 0.98)" />
        <ellipse cx="73" cy="195" rx="9" ry="12" fill="rgba(255, 248, 200, 0.2)" />
        <rect x="80" y="162" width="24" height="16" rx="3" fill="rgba(255, 252, 230, 0.35)" stroke="rgba(180, 190, 210, 0.3)" strokeWidth="1" />

        {/* ===== REAR & FRONT COUPLERS ===== */}
        <rect x="804" y="245" width="22" height="28" rx="4" fill="rgba(62, 70, 88, 0.88)" stroke="rgba(110, 120, 140, 0.3)" strokeWidth="1" />
        <rect x="808" y="255" width="14" height="8" rx="2" fill="rgba(85, 95, 115, 0.7)" />
        <circle cx="798" cy="180" r="5" fill="rgba(255, 80, 80, 0.5)" stroke="rgba(255, 120, 120, 0.4)" strokeWidth="1" />
        <circle cx="798" cy="180" r="2.5" fill="rgba(255, 80, 80, 0.8)" />
        <rect x="60" y="248" width="24" height="25" rx="3" fill="rgba(58, 65, 82, 0.9)" />
        <rect x="54" y="255" width="10" height="12" rx="2" fill="rgba(70, 78, 96, 0.85)" />

        {/* ===== FRONT BOGIE WHEELS (2 axles) ===== */}
        {[148, 248].map((cx, i) => (
          <g key={`fw-${i}`} filter="url(#wheelGlow)">
            {i === 0 && <rect x="130" y="286" width="138" height="8" rx="3" fill="rgba(48, 54, 68, 0.9)" />}
            <circle cx={cx} cy="310" r="40" fill="none" stroke={colors.wheels} strokeWidth="4.5" strokeOpacity="0.55" />
            <circle cx={cx} cy="310" r="33" fill="none" stroke={colors.wheels} strokeWidth="2.5" strokeOpacity="0.38" />
            <circle cx={cx} cy="310" r="28" fill="url(#wheelMetal)" />
            <circle cx={cx} cy="310" r="28" fill="none" stroke="rgba(175, 185, 200, 0.4)" strokeWidth="3" />
            <circle cx={cx} cy="310" r="20" fill="none" stroke="rgba(155, 165, 182, 0.45)" strokeWidth="1.8" />
            <circle cx={cx} cy="310" r="10" fill="rgba(85, 95, 115, 0.95)" stroke={colors.wheels} strokeWidth="2.2" strokeOpacity="0.6" />
            <circle cx={cx} cy="310" r="4" fill={colors.wheels} fillOpacity="0.85" />
            {[0, 45, 90, 135].map((angle) => (
              <line
                key={angle}
                x1={cx + Math.cos((angle * Math.PI) / 180) * 11}
                y1={310 + Math.sin((angle * Math.PI) / 180) * 11}
                x2={cx + Math.cos((angle * Math.PI) / 180) * 25}
                y2={310 + Math.sin((angle * Math.PI) / 180) * 25}
                stroke="rgba(145, 155, 172, 0.6)" strokeWidth="3.5" strokeLinecap="round"
              />
            ))}
            <ellipse cx={cx} cy="346" rx="28" ry="5" fill={colors.wheels} fillOpacity="0.22" />
          </g>
        ))}

        {/* ===== REAR BOGIE WHEELS (4 axles) ===== */}
        {[418, 518, 638, 738].map((cx, i) => (
          <g key={`rw-${i}`} filter="url(#wheelGlow)">
            {i === 0 && <rect x="400" y="286" width="258" height="8" rx="3" fill="rgba(48, 54, 68, 0.9)" />}
            {i === 2 && <rect x="622" y="286" width="135" height="8" rx="3" fill="rgba(48, 54, 68, 0.9)" />}
            <circle cx={cx} cy="310" r="40" fill="none" stroke={colors.wheels} strokeWidth="4.5" strokeOpacity="0.55" />
            <circle cx={cx} cy="310" r="33" fill="none" stroke={colors.wheels} strokeWidth="2.5" strokeOpacity="0.38" />
            <circle cx={cx} cy="310" r="28" fill="url(#wheelMetal)" />
            <circle cx={cx} cy="310" r="28" fill="none" stroke="rgba(175, 185, 200, 0.4)" strokeWidth="3" />
            <circle cx={cx} cy="310" r="20" fill="none" stroke="rgba(155, 165, 182, 0.45)" strokeWidth="1.8" />
            <circle cx={cx} cy="310" r="10" fill="rgba(85, 95, 115, 0.95)" stroke={colors.wheels} strokeWidth="2.2" strokeOpacity="0.6" />
            <circle cx={cx} cy="310" r="4" fill={colors.wheels} fillOpacity="0.85" />
            {[0, 45, 90, 135].map((angle) => (
              <line
                key={angle}
                x1={cx + Math.cos((angle * Math.PI) / 180) * 11}
                y1={310 + Math.sin((angle * Math.PI) / 180) * 11}
                x2={cx + Math.cos((angle * Math.PI) / 180) * 25}
                y2={310 + Math.sin((angle * Math.PI) / 180) * 25}
                stroke="rgba(145, 155, 172, 0.6)" strokeWidth="3.5" strokeLinecap="round"
              />
            ))}
            <ellipse cx={cx} cy="346" rx="28" ry="5" fill={colors.wheels} fillOpacity="0.22" />
          </g>
        ))}

        {/* ===== ID BADGE & ACCENT STRIPE ===== */}
        <rect x="128" y="238" width="72" height="22" rx="3.5" fill="rgba(28, 32, 42, 0.92)" stroke="rgba(110, 122, 145, 0.3)" strokeWidth="1" />
        <text x="164" y="253.5" textAnchor="middle" fontSize="12" fontWeight="600" fill="rgba(205, 215, 232, 0.92)" fontFamily="system-ui, -apple-system, sans-serif">
          LT-2847
        </text>
        <rect x="225" y="252" width="583" height="4" rx="1.5" fill="rgba(180, 195, 215, 0.18)" />
        <rect x="225" y="248" width="583" height="1.5" rx="0.5" fill="rgba(220, 232, 248, 0.22)" />
      </svg>
      
      <div className="absolute -bottom-6 left-0 right-0 h-8 bg-gradient-to-b from-foreground/5 to-transparent" />
    </div>
  )
}
