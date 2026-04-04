/**
 * Returns a pastel color based on a health value (0-100)
 * 100 = pastel green
 * 65 = yellow-green blend
 * 50 = pastel yellow
 * 35 = orange-red blend
 * 0 = pastel red
 *
 * Uses oklch color space for smooth perceptual interpolation
 */
export function getHealthColor(value: number): string {
  // Clamp value between 0 and 100
  const v = Math.max(0, Math.min(100, value))

  // Define color stops in oklch (lightness, chroma, hue)
  // Pastel green: oklch(0.78 0.12 145)
  // Pastel yellow: oklch(0.85 0.12 90)
  // Pastel red: oklch(0.72 0.14 25)

  let l: number, c: number, h: number

  if (v >= 50) {
    // Interpolate between green (100) and yellow (50)
    const t = (v - 50) / 50 // 0 at 50%, 1 at 100%
    l = 0.85 + (0.78 - 0.85) * t // yellow to green lightness
    c = 0.12 // keep chroma consistent
    h = 90 + (145 - 90) * t // yellow to green hue
  } else {
    // Interpolate between yellow (50) and red (0)
    const t = v / 50 // 0 at 0%, 1 at 50%
    l = 0.72 + (0.85 - 0.72) * t // red to yellow lightness
    c = 0.14 + (0.12 - 0.14) * t // red to yellow chroma
    h = 25 + (90 - 25) * t // red to yellow hue
  }

  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`
}

/**
 * Returns a CSS class-compatible color value with opacity
 */
export function getHealthColorWithOpacity(value: number, opacity: number = 1): string {
  const color = getHealthColor(value)
  if (opacity === 1) return color
  return color.replace(')', ` / ${opacity})`)
}

/**
 * Returns health status text based on value
 */
export function getHealthStatus(value: number): string {
  if (value >= 85) return "Excellent"
  if (value >= 70) return "Good"
  if (value >= 50) return "Fair"
  if (value >= 35) return "Warning"
  return "Critical"
}
