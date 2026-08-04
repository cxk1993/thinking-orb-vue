import type { AnimationMode, FrameContext } from '../engine/types'
import { angleDelta, createOrthoProjector, scaleRadius } from '../engine/core'
import type { RenderResult, Particle } from '../engine/core'

export class GlobeMode implements AnimationMode {
  readonly config = { name: 'globe', defaults: { latRings: 17, lonDensity: 44, rBase: 0.6, rDepth: 1.7, rBoost: 1.0, inkFar: 0.62, inkSpan: 0.54, rsPow: 0.6, rMin: 0.3 } }
  init(): void {}
  update(ctx: FrameContext): RenderResult {
    const { time, size, opts } = ctx; const spin = 0.5; const R = size * 0.41
    const tilt = 0.4 + 0.06 * Math.sin(time * 0.35)
    const pt = createOrthoProjector(time * spin, tilt, size / 2, size / 2, R)
    const scan = time * (spin + (1.7 - spin) * (opts.scanMul ?? 1))
    const rs = scaleRadius(size, opts.rsPow ?? 0.6); const dimBase = opts.dimBase ?? 1
    const bg: Particle[] = []; const hl: Particle[] = []
    const latRings = opts.latRings ?? 17; const lonDensity = opts.lonDensity ?? 44
    for (let li = 0; li <= latRings; li++) {
      const lat = -Math.PI / 2 + (li / latRings) * Math.PI; const cosLat = Math.cos(lat); const sinLat = Math.sin(lat)
      const lonCount = Math.max(1, Math.round(Math.abs(cosLat) * lonDensity))
      for (let lj = 0; lj < lonCount; lj++) {
        const lon = (lj / lonCount) * 2 * Math.PI
        const [px, py, z] = pt(cosLat * Math.cos(lon), sinLat, cosLat * Math.sin(lon)); const d = (z + 1) / 2
        const dd = angleDelta(lon + time * spin, scan); const boost = Math.exp(-(dd * dd) / 0.18) * Math.max(0, z)
        const p: Particle = { x: 0, y: 0, z, sx: px, sy: py, depth: d, radius: ((opts.rBase ?? 0.6) + (opts.rDepth ?? 1.7) * d + (opts.rBoost ?? 1) * boost) * rs, brightness: (opts.inkFar ?? 0.62) - (opts.inkSpan ?? 0.54) * d, alpha: dimBase + (1 - dimBase) * Math.min(1, boost) }
        if (boost > 0.3) hl.push(p); else bg.push(p)
      }
    }
    return { background: { particles: bg, edges: [] }, main: { particles: [], edges: [] }, highlight: { particles: hl, edges: [] } }
  }
  destroy(): void {}
}