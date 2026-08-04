import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
export type OrbTheme = 'auto' | 'dark' | 'light'
function ancestorTheme(el: Element | null): boolean | null {
  let node: Element | null = el
  while (node) {
    const attr = node.getAttribute('data-theme'); if (attr === 'dark') return true; if (attr === 'light') return false
    if (node.classList.contains('dark')) return true; if (node.classList.contains('light')) return false
    node = node.parentElement
  }
  return null
}
function systemDark(): boolean { return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches }
export function useOrbTheme(theme: Ref<OrbTheme>, hostRef: Ref<HTMLElement | null>): Ref<boolean> {
  const isDark = ref(true)
  const resolve = () => {
    if (theme.value === 'dark') { isDark.value = true; return }
    if (theme.value === 'light') { isDark.value = false; return }
    isDark.value = ancestorTheme(hostRef.value) ?? systemDark()
  }
  let mq: MediaQueryList | null = null; let mo: MutationObserver | null = null
  onMounted(() => {
    resolve()
    if (typeof matchMedia !== 'undefined') { mq = matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener('change', resolve) }
    if (typeof MutationObserver !== 'undefined') {
      mo = new MutationObserver(resolve); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'], subtree: true })
    }
  })
  onUnmounted(() => { mq?.removeEventListener('change', resolve); mo?.disconnect() })
  watch(theme, resolve); return isDark
}
export function useReducedMotion(): Ref<boolean> {
  const reduced = ref(false)
  onMounted(() => {
    if (typeof matchMedia === 'undefined') return
    const mq = matchMedia('(prefers-reduced-motion: reduce)'); reduced.value = mq.matches
    const handler = (e: MediaQueryListEvent) => { reduced.value = e.matches }
    mq.addEventListener('change', handler); onUnmounted(() => mq.removeEventListener('change', handler))
  })
  return reduced
}