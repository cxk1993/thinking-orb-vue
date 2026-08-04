import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { subscribeToClock } from '../engine/clock'
import { renderLayers, emptyRenderResult } from '../engine/core'
import type { RenderResult } from '../engine/core'
import { resolvePreset, registerBuiltinModes, type OrbState } from '../presets'
import { modeRegistry } from '../registry'
export interface AnimationControls { isRunning: Ref<boolean>; currentFps: Ref<number>; pause: () => void; resume: () => void }
export function useOrbAnimation(
  canvasRef: Ref<HTMLCanvasElement | null>, state: Ref<OrbState>, size: Ref<number>,
  dark: Ref<boolean>, speed: Ref<number>, paused: Ref<boolean>, reduced: Ref<boolean>,
): AnimationControls {
  const isRunning = ref(false); const currentFps = ref(60)
  let unsubscribe: (() => void) | null = null; let io: IntersectionObserver | null = null
  let visible = true; let lastSize = 0; let lastDpr = 1
  registerBuiltinModes()
  const _drawFrame = (time: number) => {
    const canvas = canvasRef.value; if (!canvas || !visible || paused.value) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const dpr = Math.min(2, typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1)
    const currentSize = size.value
    if (currentSize !== lastSize || dpr !== lastDpr) { canvas.width = Math.round(currentSize * dpr); canvas.height = Math.round(currentSize * dpr); lastSize = currentSize; lastDpr = dpr }
    const { speed: baseSpeed, density, opts } = resolvePreset(state.value, currentSize); const effSpeed = baseSpeed * speed.value
    const modeInstance = modeRegistry.get(state.value)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, currentSize, currentSize)
    if (modeInstance) {
      const frameCtx = { time: time * effSpeed, delta: 0.016, size: currentSize, dark: dark.value, speed: effSpeed, projector: ((x: number, y: number, _z: number) => [x, y, 0]) as any, opts: { ...opts, density } }
      let result: RenderResult; try { result = modeInstance.update(frameCtx) } catch { result = emptyRenderResult() }
      renderLayers(ctx, result, dark.value)
    }
  }
  onMounted(() => {
    const canvas = canvasRef.value; if (!canvas) return
    if (typeof IntersectionObserver !== 'undefined') { io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }); io.observe(canvas) }
    unsubscribe = subscribeToClock(_drawFrame); isRunning.value = true
    onUnmounted(() => { unsubscribe?.(); io?.disconnect(); isRunning.value = false })
  })
  return { isRunning, currentFps, pause: () => { paused.value = true }, resume: () => { paused.value = false } }
}