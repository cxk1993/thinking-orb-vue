type TickCallback = (time: number, delta: number) => void
let _rafId = 0; let _running = false; let _lastTime = 0; let _callbacks = new Set<TickCallback>()
let _fps = 60; let _frameInterval = 1000 / 60; let _lastFrameTime = 0; let _frameCount = 0; let _lastFpsCheck = 0

function _tick(now: number) {
  if (!_running) return; _frameCount++
  if (now - _lastFpsCheck >= 1000) {
    const actualFps = _frameCount / ((now - _lastFpsCheck) / 1000); _lastFpsCheck = now; _frameCount = 0
    if (actualFps < _fps * 0.7 && _fps > 15) { _fps = Math.max(15, _fps / 2); _frameInterval = 1000 / _fps }
    else if (actualFps > _fps * 0.95 && _fps < 60) { _fps = Math.min(60, _fps * 2); _frameInterval = 1000 / _fps }
  }
  if (now - _lastFrameTime < _frameInterval - 1) { _rafId = requestAnimationFrame(_tick); return }
  _lastFrameTime = now; const delta = _lastTime ? (now - _lastTime) / 1000 : 0.016; _lastTime = now; const time = now / 1000
  for (const cb of _callbacks) { try { cb(time, delta) } catch { /* isolate */ } }
  _rafId = requestAnimationFrame(_tick)
}
export function subscribeToClock(cb: TickCallback): () => void {
  _callbacks.add(cb); _startIfNeeded()
  return () => { _callbacks.delete(cb); _stopIfIdle() }
}
function _startIfNeeded() {
  if (!_running && _callbacks.size > 0) {
    _running = true; _lastTime = 0; _lastFrameTime = 0; _frameCount = 0; _lastFpsCheck = 0; _fps = 60; _frameInterval = 1000 / 60
    _rafId = requestAnimationFrame(_tick)
  }
}
function _stopIfIdle() {
  if (_running && _callbacks.size === 0) { _running = false; cancelAnimationFrame(_rafId); _lastTime = 0 }
}
export function getCurrentFps(): number { return _fps }
export function resetClock(): void { _running = false; cancelAnimationFrame(_rafId); _callbacks.clear(); _lastTime = 0 }