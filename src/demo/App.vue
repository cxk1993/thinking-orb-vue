<template>
  <div class="demo-app">
    <header>
      <h1>✦ Thinking Orb Vue</h1>
      <p>点阵思维球体动画 — 9 种状态 · Vue 3 · Canvas 2D</p>
    </header>

    <div class="theme-toggle">
      <button @click="toggleTheme">
        {{ theme === 'dark' ? '☀️ 亮色模式' : '🌙 暗色模式' }}
      </button>
      <label class="speed-label">
        速度：{{ speed.toFixed(1) }}x
        <input type="range" min="0.1" max="3" step="0.1" v-model.number="speed" />
      </label>
    </div>

    <div class="orb-grid">
      <div v-for="st in states" :key="st" class="orb-card" :class="{ active: activeState === st }" @click="activeState = st">
        <ThinkingOrb
          :state="st"
          :size="96"
          :theme="theme"
          :speed="speed"
        />
        <div class="orb-label">
          <span class="orb-name">{{ st }}</span>
          <span class="orb-desc">{{ descriptions[st] }}</span>
        </div>
      </div>
    </div>

    <div class="preview-panel">
      <h2>预览 — {{ activeState }}</h2>
      <p class="preview-desc">{{ descriptions[activeState] }}</p>
      <div class="preview-sizes">
        <div class="size-item">
          <ThinkingOrb :state="activeState" :size="64" :theme="theme" :speed="speed" />
          <span>64px</span>
        </div>
        <div class="size-item">
          <ThinkingOrb :state="activeState" :size="96" :theme="theme" :speed="speed" />
          <span>96px</span>
        </div>
        <div class="size-item">
          <ThinkingOrb :state="activeState" :size="128" :theme="theme" :speed="speed" />
          <span>128px</span>
        </div>
        <div class="size-item">
          <ThinkingOrb :state="activeState" :size="20" :theme="theme" :speed="speed" />
          <span>20px</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>基于 <a href="https://github.com/Jakubantalik/thinking-orbs" target="_blank">thinking-orbs</a> 的灵感 ·
      独创 Vue 3 实现 · 插件化架构 · 多层渲染 · 全局时钟</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThinkingOrb, ALL_STATES } from '../index'
import type { OrbState } from '../presets'

const states = ALL_STATES
const activeState = ref<OrbState>('working')
const theme = ref<'dark' | 'light'>('dark')
const speed = ref(1)

const descriptions: Record<string, string> = {
  working: '粒子在倾斜轨道上运行',
  searching: '扫描子午线扫过点阵球体',
  solving: '色带扭动后复位',
  listening: '波形在纬度环上滚动',
  connecting: '星座连线，信号包传输',
  weaving: '三股辫子围绕球体编织',
  composing: '多条带状波浪摆动',
  breathing: '正面圆形环缓慢脉动',
  shaping: '点状轮廓变形',
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: oklch(0.13 0.01 285);
  color: oklch(0.92 0 0);
  min-height: 100vh;
}

.demo-app {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px;
}

header {
  text-align: center;
  margin-bottom: 48px;
}

header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

header p {
  color: oklch(0.6 0 0);
  font-size: 0.95rem;
}

.theme-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.theme-toggle button {
  padding: 8px 20px;
  border: 1px solid oklch(0.3 0 0);
  border-radius: 8px;
  background: oklch(0.18 0 0);
  color: oklch(0.85 0 0);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.theme-toggle button:hover {
  background: oklch(0.25 0 0);
  border-color: oklch(0.4 0 0);
}

.speed-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: oklch(0.6 0 0);
}

.speed-label input[type="range"] {
  width: 120px;
  accent-color: #a8edea;
}

.orb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 48px;
}

.orb-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 12px;
  border: 1px solid oklch(0.25 0 0);
  border-radius: 12px;
  background: oklch(0.15 0 0);
  cursor: pointer;
  transition: all 0.2s;
}

.orb-card:hover {
  border-color: oklch(0.4 0 0);
  background: oklch(0.18 0 0);
}

.orb-card.active {
  border-color: #a8edea;
  box-shadow: 0 0 20px oklch(0.8 0.1 180 / 0.15);
}

.orb-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.orb-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: oklch(0.85 0 0);
}

.orb-desc {
  font-size: 0.7rem;
  color: oklch(0.5 0 0);
}

.preview-panel {
  text-align: center;
  padding: 32px;
  border: 1px solid oklch(0.25 0 0);
  border-radius: 12px;
  background: oklch(0.12 0 0);
  margin-bottom: 32px;
}

.preview-panel h2 {
  font-size: 1.3rem;
  margin-bottom: 4px;
}

.preview-desc {
  color: oklch(0.55 0 0);
  font-size: 0.85rem;
  margin-bottom: 24px;
}

.preview-sizes {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 32px;
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.size-item span {
  font-size: 0.75rem;
  color: oklch(0.5 0 0);
}

.footer {
  text-align: center;
  font-size: 0.8rem;
  color: oklch(0.4 0 0);
}

.footer a {
  color: #a8edea;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>