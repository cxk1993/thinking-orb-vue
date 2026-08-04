# Thinking Orb Vue

> 点阵思维球体动画组件 — 9 种 AI Agent 状态动画
> 纯 Canvas 2D · 无 WebGL · 跨浏览器

基于 [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) 的灵感，独创 Vue 3 实现。

---

## 架构总览

```
thinking-orb-vue/
├── src/
│   ├── ThinkingOrb.vue            # Vue 3 主组件
│   ├── index.ts                   # 库入口
│   ├── presets.ts                 # 9 种状态配置 + 密度插值
│   ├── registry.ts                # ★ 独创：插件注册系统
│   ├── engine/
│   │   ├── core.ts                # ★ 独创：多层渲染管线 + 3D 数学
│   │   ├── clock.ts               # ★ 独创：全局共享时钟 + 自适应帧率
│   │   └── types.ts               # AnimationMode 接口
│   ├── modes/
│   │   ├── OrbitsMode.ts          # working
│   │   ├── GlobeMode.ts           # searching
│   │   ├── RubikMode.ts           # solving
│   │   ├── WaveMode.ts            # listening
│   │   ├── WebMode.ts             # connecting
│   │   ├── BraidMode.ts           # weaving
│   │   ├── RibbonMode.ts          # composing
│   │   ├── RingMode.ts            # breathing
│   │   └── MorphMode.ts           # ★ 独创：可扩展形状注册
│   └── composables/
│       ├── useOrbTheme.ts         # Vue 3 主题检测
│       └── useOrbAnimation.ts     # 动画循环
```

## 独创性对照表

| 维度 | 原版 thinking-orbs | 本实现 |
|------|-------------------|--------|
| **框架** | React + useEffect | **Vue 3 组合式 API** |
| **架构模式** | 函数式 `ModeDraw` | **类 + 插件注册系统**，生命周期 `init → update → destroy` |
| **渲染管线** | 单层 paint，z-sort 后统一绘制 | **三层独立合成**：background（背景幽灵粒子）、main（主粒子）、highlight（高亮粒子） |
| **时钟同步** | 每个实例独立 rAF，异步 | **全局单例时钟**，所有实例共享 + 自适应帧率（60→30→15fps） |
| **尺寸系统** | 硬编码 64px / 20px 两种 | **任意尺寸**，密度自动插值，支持响应式 |
| **形状系统** | 硬编码 3 种形状 | **可扩展注册表**，`registerShape()` 可添加自定义形状 |
| **主题检测** | React hooks | Vue 3 composable + `usePreferredDark` 风格 |
| **性能优化** | IntersectionObserver | 全局时钟 + 自适应帧率 + IntersectionObserver + visibilitychange |

## 9 种状态动画

| 状态 | 模式名 | 描述 |
|------|--------|------|
| `working` | web | **星座连线，信号包在节点间传输**（主力工作态） |
| `searching` | globe | 扫描子午线扫过点阵球体 |
| `solving` | rubik | 色带扭动后复位（魔方风格） |
| `listening` | wave | 波形在纬度环上滚动 |
| `connecting` | orbits | 粒子在倾斜轨道上运行 |
| `weaving` | braid | 三股辫子围绕球体编织 |
| `composing` | ribbon | 多条带状波浪在轨道上摆动 |
| `breathing` | ring | 正面圆形环缓慢脉动 |
| `shaping` | morph | 点状轮廓在圆→三角→方形之间变形 |

## 快速开始

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build          # 构建库（dist/）
npm run build:demo     # 构建 demo（demo-dist/）
```

## 在 Vue 3 项目中使用

```vue
<template>
  <ThinkingOrb state="working" :size="64" />
  <ThinkingOrb state="searching" :size="96" speed="1.5" />
  <ThinkingOrb state="solving" :size="128" theme="light" />
</template>

<script setup>
import { ThinkingOrb } from 'thinking-orb-vue'
</script>
```

## 集成到 OpenSquilla

### 步骤

1. 克隆 opensquilla 源码（在 Windows 上用 Git Bash 或 PowerShell）：
   ```bash
   git clone https://github.com/opensquilla/opensquilla.git
   cd opensquilla
   ```

2. 复制组件到 opensquilla-webui：
   ```bash
   # 将 thinking-orb-vue/src/ 下的文件复制到
   # opensquilla-webui/src/components/thinking-orb/
   ```

3. 在 opensquilla-webui 中注册组件：
   ```typescript
   // opensquilla-webui/src/main.ts
   import { ThinkingOrb } from './components/thinking-orb/ThinkingOrb.vue'
   ```

4. 替换现有 LoadingSpinner：
   ```vue
   <!-- 原：<LoadingSpinner /> -->
   <!-- 改为：-->
   <ThinkingOrb :state="agentState" :size="32" />
   ```

### PR 提交

```bash
cd opensquilla
git checkout -b feat/thinking-orb-vue-component
git add opensquilla-webui/src/components/thinking-orb/
git commit -m "feat(webui): add ThinkingOrb Vue component for agent state animations"
git push origin feat/thinking-orb-vue-component
```

然后在 GitHub 上创建 PR。

## 许可

MIT