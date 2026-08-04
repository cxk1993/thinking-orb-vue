export interface Vec3 { x: number; y: number; z: number }
export interface Particle {
  x: number; y: number; z: number
  sx: number; sy: number; depth: number; radius: number; brightness: number; alpha: number
  vx?: number; vy?: number; vz?: number
}
export interface Edge { x1: number; y1: number; x2: number; y2: number; brightness: number; alpha: number; width: number }
export interface RenderLayer { particles: Particle[]; edges: Edge[] }
export interface RenderResult { background: RenderLayer; main: RenderLayer; highlight: RenderLayer }
export type Projector = (x: number, y: number, z: number) => [number, number, number]
export function lerp(a: number, b: number, f: number): number { return a + (b - a) * f }
export function fract(x: number): number { return x - Math.floor(x) }
export function smoothstep(t: number): number { return t * t * (3 - 2 * t) }
export function clamp(v: number, min: number, max: number): number { return Math.max(min, Math.min(max, v)) }
export function valueNoise2D(x: number, y: number): number {
  const xi = Math.floor(x); const yi = Math.floor(y)
  let fx = x - xi; let fy = y - yi; fx = smoothstep(fx); fy = smoothstep(fy)
  const a = hash(xi, yi); const b = hash(xi + 1, yi); const c = hash(xi, yi + 1); const d = hash(xi + 1, yi + 1)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}
export function hash(a: number, b: number): number {
  const h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return h - Math.floor(h)
}
export function fibonacciSphere(i: number, n: number): [number, number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5)); const y = 1 - (2 * (i + 0.5)) / n
  const rad = Math.sqrt(Math.max(0, 1 - y * y)); const a = i * golden
  return [rad * Math.cos(a), y, rad * Math.sin(a)]
}
export function angleDelta(a: number, b: number): number { return Math.atan2(Math.sin(a - b), Math.cos(a - b)) }
export function createOrthoProjector(yaw: number, tilt: number, cx: number, cy: number, scale: number): Projector {
  const st = Math.sin(tilt); const ct = Math.cos(tilt); const sy = Math.sin(yaw); const cyw = Math.cos(yaw)
  return (x, y, z) => {
    const x1 = x * cyw + z * sy; const z1 = -x * sy + z * cyw; const y1 = y * ct - z1 * st; const z2 = y * st + z1 * ct
    return [cx + x1 * scale, cy - y1 * scale, z2]
  }
}
export function renderLayers(ctx: CanvasRenderingContext2D, result: RenderResult, dark: boolean, rMin = 0.3): void {
  _drawEdges(ctx, result.background.edges, dark); _drawEdges(ctx, result.main.edges, dark); _drawEdges(ctx, result.highlight.edges, dark)
  _drawParticles(ctx, result.background.particles, dark, rMin); _drawParticles(ctx, result.main.particles, dark, rMin); _drawParticles(ctx, result.highlight.particles, dark, rMin)
}
function _drawEdges(ctx: CanvasRenderingContext2D, edges: Edge[], dark: boolean): void {
  for (const e of edges) {
    if (e.alpha < 0.02) continue; const w = clamp(e.brightness, 0, 1); const g = Math.round((dark ? 1 - w : w) * 255)
    ctx.strokeStyle = `rgba(${g},${g},${g},${e.alpha})`; ctx.lineWidth = e.width; ctx.beginPath(); ctx.moveTo(e.x1, e.y1); ctx.lineTo(e.x2, e.y2); ctx.stroke()
  }
}
function _drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], dark: boolean, rMin: number): void {
  particles.sort((a, b) => a.z - b.z)
  for (const p of particles) {
    if (p.alpha < 0.02) continue; const w = clamp(p.brightness, 0, 1); const g = Math.round((dark ? 1 - w : w) * 255)
    ctx.fillStyle = `rgba(${g},${g},${g},${p.alpha})`; ctx.beginPath(); ctx.arc(p.sx, p.sy, Math.max(rMin, p.radius), 0, Math.PI * 2); ctx.fill()
  }
}
export function emptyLayer(): RenderLayer { return { particles: [], edges: [] } }
export function emptyRenderResult(): RenderResult { return { background: emptyLayer(), main: emptyLayer(), highlight: emptyLayer() } }
export function scaleRadius(size: number, pow = 0.6): number { return (size / 300) ** pow }