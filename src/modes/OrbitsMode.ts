import type { AnimationMode, FrameContext } from '../engine/types'
import { createOrthoProjector, hash, scaleRadius } from '../engine/core'
import type { RenderResult, Particle } from '../engine/core'

export class OrbitsMode implements AnimationMode {
  readonly config = { name: 'orbits', defaults: { orbitN: 12, ghostN: 40, ghostR: 0.9, ghostA: 0.5, particles: 3, partR: 1.2, partRDepth: 1.6, rsPow: 0.6, rMin: 0.3 } }
  private _cache: Array<any> = []
  init(): void { this._cache = [] }
  update(ctx: FrameContext): RenderResult {
    const { time, size, opts } = ctx; const R = size * 0.41; const rs = scaleRadius(size, opts.rsPow ?? 0.6)
    const orbitN = opts.orbitN ?? 12; const ghostN = opts.ghostN ?? 40; const particles = opts.particles ?? 3
    const pt = createOrthoProjector(time * 0.12, 0.3, size / 2, size / 2, 1)
    if (this._cache.length !== orbitN) {
      this._cache = []
      for (let orb = 0; orb < orbitN; orb++) {
        const h1 = hash(orb, 1.7); const h2 = hash(orb, 5.2); const h3 = hash(orb, 8.9)
        const ro = R * (0.45 + 0.52 * h1); const th = h1 * 2 * Math.PI; const phi = Math.acos(2 * h2 - 1)
        const nx = Math.sin(phi) * Math.cos(th); const ny = Math.cos(phi); const nz = Math.sin(phi) * Math.sin(th)
        let ux = -ny; let uy = nx; const uz = 0; const ul = Math.max(1e-6, Math.sqrt(ux * ux + uy * uy)); ux /= ul; uy /= ul
        const vx = ny * uz - nz * uy; const vy = nz * ux - nx * uz; const vz = nx * uy - ny * ux
        const speed = (0.25 + 0.55 * h3) * (h3 > 0.5 ? 1 : -1)
        this._cache.push({ ro, nx, ny, nz, ux, uy, uz, vx, vy, vz, speed })
      }
    }
    const bg: Particle[] = []; const main: Particle[] = []
    for (const orb of this._cache) {
      for (let k = 0; k < ghostN; k++) {
        const a = (k / ghostN) * 2 * Math.PI
        const [px, py, z] = pt((orb.ux * Math.cos(a) + orb.vx * Math.sin(a)) * orb.ro, (orb.uy * Math.cos(a) + orb.vy * Math.sin(a)) * orb.ro, (orb.uz * Math.cos(a) + orb.vz * Math.sin(a)) * orb.ro)
        const d = (z / orb.ro + 1) / 2
        bg.push({ x: 0, y: 0, z, sx: px, sy: py, depth: d, radius: (opts.ghostR ?? 0.9) * rs, brightness: 0.72, alpha: (opts.ghostA ?? 0.5) * (0.4 + 0.6 * d) })
      }
      for (let m = 0; m < particles; m++) {
        const a = time * orb.speed + (m / particles) * 2 * Math.PI + hash(orb.ro, m) * 6
        const [px, py, z] = pt((orb.ux * Math.cos(a) + orb.vx * Math.sin(a)) * orb.ro, (orb.uy * Math.cos(a) + orb.vy * Math.sin(a)) * orb.ro, (orb.uz * Math.cos(a) + orb.vz * Math.sin(a)) * orb.ro)
        const d = (z / orb.ro + 1) / 2
        main.push({ x: 0, y: 0, z, sx: px, sy: py, depth: d, radius: ((opts.partR ?? 1.2) + (opts.partRDepth ?? 1.6) * d) * rs, brightness: 0.3 - 0.22 * d, alpha: 0.8 + 0.2 * d })
      }
    }
    return { background: { particles: bg, edges: [] }, main: { particles: main, edges: [] }, highlight: { particles: [], edges: [] } }
  }
  destroy(): void { this._cache = [] }
}