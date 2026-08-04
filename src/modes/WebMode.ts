import type { AnimationMode, FrameContext } from '../engine/types'
import { createOrthoProjector, fibonacciSphere, fract, hash, lerp, scaleRadius, valueNoise2D } from '../engine/core'
import type { RenderResult, Particle, Edge } from '../engine/core'
export class WebMode implements AnimationMode {
  readonly config = { name: 'web', defaults: { nodeN: 30, thr: 0.72, signals: 5, nodeR: 1.4, nodeRDepth: 1.8, lineW: 0.8, rsPow: 0.6, rMin: 0.3 } }
  init(): void {}
  update(ctx: FrameContext): RenderResult {
    const { time, size, opts } = ctx; const R = size * 0.4 * (opts.spread ?? 1)
    const pt = createOrthoProjector(time * 0.12, 0.32, size / 2, size / 2, R); const rs = scaleRadius(size, opts.rsPow ?? 0.6)
    const nodeN = opts.nodeN ?? 30; const thr = opts.thr ?? 0.72; const nodeR = opts.nodeR ?? 1.4; const nodeRDepth = opts.nodeRDepth ?? 1.8
    const nodes: Array<[number, number, number]> = []
    for (let i = 0; i < nodeN; i++) {
      const d = fibonacciSphere(i, nodeN)
      const x = d[0] + 0.3 * (valueNoise2D(i * 0.31 + 9, time * 0.24) - 0.5) * 2
      const y = d[1] + 0.3 * (valueNoise2D(i * 0.53 + 27, time * 0.21) - 0.5) * 2
      const z = d[2] + 0.3 * (valueNoise2D(i * 0.77 + 55, time * 0.27) - 0.5) * 2
      const l = Math.sqrt(x * x + y * y + z * z); nodes.push([x / l, y / l, z / l])
    }
    const edges: Edge[] = []; const bg: Particle[] = []; const hl: Particle[] = []
    for (let i = 0; i < nodeN; i++) {
      for (let j = i + 1; j < nodeN; j++) {
        const dx = nodes[i][0] - nodes[j][0]; const dy = nodes[i][1] - nodes[j][1]; const dz = nodes[i][2] - nodes[j][2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist >= thr) continue
        const [x1, y1, z1] = pt(nodes[i][0], nodes[i][1], nodes[i][2]); const [x2, y2, z2] = pt(nodes[j][0], nodes[j][1], nodes[j][2])
        const d = ((z1 + z2) / 2 + 1) / 2
        edges.push({ x1, y1, x2, y2, brightness: 0.42, alpha: (1 - dist / thr) * (0.3 + 0.55 * d), width: Math.max(0.6, (opts.lineW ?? 0.8) * rs) })
      }
    }
    for (let i = 0; i < nodeN; i++) {
      const [px, py, z] = pt(nodes[i][0], nodes[i][1], nodes[i][2]); const d = (z + 1) / 2
      bg.push({ x: 0, y: 0, z, sx: px, sy: py, depth: d, radius: (nodeR + nodeRDepth * d) * (1 + 0.25 * Math.sin(time * 1.4 + i * 2.7)) * rs, brightness: 0.55 - 0.45 * d, alpha: 0.7 + 0.3 * d })
    }
    const signals = opts.signals ?? 5
    for (let s = 0; s < signals; s++) {
      const seg = Math.floor(time * 0.55 + s * 7.31)
      const a = Math.floor(hash(seg, s * 3.1 + 1.7) * nodeN); const b = Math.floor(hash(seg, s * 5.7 + 4.2) * nodeN)
      if (a === b) continue; const f = fract(time * 0.55 + s * 7.31)
      const x = lerp(nodes[a][0], nodes[b][0], f); const y = lerp(nodes[a][1], nodes[b][1], f); const z = lerp(nodes[a][2], nodes[b][2], f)
      const l = Math.max(1e-6, Math.sqrt(x * x + y * y + z * z)); const [px, py, zr] = pt(x / l, y / l, z / l); const d = (zr + 1) / 2
      hl.push({ x: 0, y: 0, z: zr, sx: px, sy: py, depth: d, radius: (nodeR * 1.5 + nodeRDepth * d) * rs, brightness: 0.05, alpha: 0.5 + 0.5 * d })
    }
    return { background: { particles: [], edges: [] }, main: { particles: bg, edges }, highlight: { particles: hl, edges: [] } }
  }
  destroy(): void {}
}