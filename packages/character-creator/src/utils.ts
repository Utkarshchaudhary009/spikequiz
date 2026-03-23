/**
 * SVG path utilities for Duolingo-style shapes
 * All shapes use rounded edges (no sharp corners)
 */

/**
 * Creates a rounded rectangle path
 * Duolingo uses rounded rectangles as the primary shape
 */
export function roundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string {
  const r = Math.min(radius, width / 2, height / 2)
  return `
    M ${x + r} ${y}
    H ${x + width - r}
    Q ${x + width} ${y} ${x + width} ${y + r}
    V ${y + height - r}
    Q ${x + width} ${y + height} ${x + width - r} ${y + height}
    H ${x + r}
    Q ${x} ${y + height} ${x} ${y + height - r}
    V ${y + r}
    Q ${x} ${y} ${x + r} ${y}
    Z
  `.trim()
}

/**
 * Creates a pill shape (fully rounded rectangle)
 * Used for eyes, shadows, and highlights
 */
export function pill(x: number, y: number, width: number, height: number): string {
  return roundedRect(x, y, width, height, Math.min(width, height) / 2)
}

/**
 * Creates a circle path
 */
export function circle(cx: number, cy: number, r: number): string {
  return `
    M ${cx - r} ${cy}
    A ${r} ${r} 0 1 1 ${cx + r} ${cy}
    A ${r} ${r} 0 1 1 ${cx - r} ${cy}
    Z
  `.trim()
}

/**
 * Creates an ellipse path
 */
export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `
    M ${cx - rx} ${cy}
    A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy}
    A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy}
    Z
  `.trim()
}

/**
 * Creates a rounded triangle path
 * The third basic shape in Duolingo's toolkit
 */
export function roundedTriangle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  radius: number,
): string {
  // Simplified rounded triangle using curves
  return `
    M ${x1} ${y1}
    Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - radius} ${x2} ${y2}
    Q ${(x2 + x3) / 2 + radius} ${(y2 + y3) / 2} ${x3} ${y3}
    Q ${(x3 + x1) / 2 - radius} ${(y3 + y1) / 2} ${x1} ${y1}
    Z
  `.trim()
}

/**
 * Darkens a hex color by a percentage
 * Used for nose/shadow colors based on skin tone
 */
export function darkenColor(hex: string, percent: number): string {
  const num = Number.parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - Math.round(255 * (percent / 100)))
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * (percent / 100)))
  const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * (percent / 100)))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * Lightens a hex color by a percentage
 * Used for highlights
 */
export function lightenColor(hex: string, percent: number): string {
  const num = Number.parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + Math.round(255 * (percent / 100)))
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100)))
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * (percent / 100)))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * Converts character config to a serializable string for localStorage/DB
 */
export function serializeCharacter(config: unknown): string {
  return JSON.stringify(config)
}

/**
 * Parses a serialized character config
 */
export function deserializeCharacter<T>(str: string): T {
  return JSON.parse(str) as T
}
