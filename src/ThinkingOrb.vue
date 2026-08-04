<template>
  <canvas ref="canvasRef" :style="canvasStyle" role="img" :aria-label="ariaLabel" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOrbTheme, useReducedMotion, type OrbTheme } from './composables/useOrbTheme'
import { useOrbAnimation } from './composables/useOrbAnimation'
import { STATE_LABELS, type OrbState } from './presets'

const props = withDefaults(defineProps<{
  state?: OrbState; size?: number; theme?: OrbTheme; speed?: number; paused?: boolean; 'aria-label'?: string
}>(), { state: 'working', size: 64, theme: 'auto', speed: 1, paused: false })

const canvasRef = ref<HTMLCanvasElement | null>(null)
const stateRef = ref(props.state); const sizeRef = ref(props.size); const speedRef = ref(props.speed)
const pausedRef = ref(props.paused); const themeRef = ref(props.theme)
const isDark = useOrbTheme(themeRef, canvasRef); const reduced = useReducedMotion()

useOrbAnimation(canvasRef, stateRef, sizeRef, isDark, speedRef, pausedRef, reduced)

watch(() => props.state, (v) => { stateRef.value = v })
watch(() => props.size, (v) => { sizeRef.value = v })
watch(() => props.speed, (v) => { speedRef.value = v })
watch(() => props.paused, (v) => { pausedRef.value = v })
watch(() => props.theme, (v) => { themeRef.value = v })

const canvasStyle = computed(() => ({ width: `${props.size}px`, height: `${props.size}px`, display: 'block' }))
const ariaLabel = computed(() => props['aria-label'] ?? STATE_LABELS[props.state] ?? '工作中…')
</script>