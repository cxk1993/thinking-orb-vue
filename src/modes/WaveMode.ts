import type { AnimationMode, FrameContext } from '../engine/types'
import { createOrthoProjector, scaleRadius } from '../engine/core'
import type { RenderResult, Particle } from '../engine/core'
export class WaveMode implements AnimationMode {
  readonly config = { name: 'wave', defaults: { rings: 15, lonDensity: 40, rBase: 0.6, rDepth: 1.7, rsPow: 0.6, rMin: 0.3 } }
  init(): void {}
  update(ctx: FrameContext): RenderResult {
    const { time, size, opts } = ctx; const R = size * 0.437
    const pt = createOrthoProjector(time * 0.18, 0.38, size / 2, size / 2, 1); const rs = scaleRadius(size, opts.rsPow ?? 0.6)
    const bg: Particle[] = []; const hl: Particle[] = []; const rings = opts.rings ?? 15; const lonDensity = opts.lonDensity ?? 40
    for (let ri = 0; ri <= rings; ri++) {
      const lat = -Math.PI / 2 + (ri / rings) * Math.PI; const cosLat = Math.cos(lat); const sinLat = Math.sin(lat)
      const w = 0.5 * Math.sin(time * 2.1 - ri * 0.52) + 0.3 * Math.sin(time * 1.27 + ri * 0.83) + 0.2 * Math.sin(time * 3.4 - ri * 1.1)
      const rr = R * (0.88 + 0.105 * w); const lonCount = Math.max(1, Math.round(Math.abs(cosLat) * lonDensity))
      for (let lj = 0; lj < lonCount; lj++) {
        const lon = (lj / lonCount) * 2 * Math.PI
        const [px, py, z] = pt(cosLat * Math.cos(lon) * rr, sinLat * rr, cosLat * Math.sin(lon) * rr)
        const d = (z / R + 1) / 2; const crest = Math.max(0, w)
        const p: Particle = { x: 0, y: 0, z, sx: px, sy: py, depth: d, radius: ((opts.rBase ?? 0.6) + (opts.rDepth ?? 1.7) * d) * (1 + 0.4 * crest) * rs, brightness: 0.66 - 0.56 * d - 0.1 * crest, alpha: 0.6 + 0.4 * d }
        if (crest > 0.5) hl.push(p); else bg.push(p)
      }
    }
    return { background: { particles: bg, edges: [] }, main: { particles: [], edges: [] }, highlight: { particles: hl, edges: [] } }
  }
  destroy(): void {}
}