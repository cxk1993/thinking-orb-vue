# Thinking Orb Vue — 独创性说明

基于 [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) 的灵感，独创 Vue 3 实现。

## 架构差异

| 维度 | 原版 thinking-orbs | 本实现 |
|------|-------------------|--------|
| **框架** | React + hooks | **Vue 3 组合式 API** |
| **模式架构** | 函数式 `ModeDraw` | **类 + 插件注册系统**，生命周期 `init → update → destroy` |
| **渲染管线** | 单层 paint | **三层独立合成**：background（背景幽灵粒子）、main（主粒子）、highlight（高亮粒子） |
| **时钟同步** | 每个实例独立 rAF | **全局单例时钟**，所有实例共享 + 自适应帧率（60→30→15fps） |
| **尺寸系统** | 硬编码 64px / 20px 两种 | **任意尺寸**，密度自动插值，支持响应式 |
| **形状系统** | 硬编码 3 种形状 | **可扩展注册表**，`registerShape()` 可添加自定义形状 |
| **Wave 波形** | 双波叠加 | **三波形叠加**，更丰富 |
| **Ring 呼吸** | 纯正弦波 | **正弦波 + 噪声混合**，更有机 |
| **Braid 编织** | 单色三股 | **三股不同亮度偏移**，更有层次感 |
| **故障保护** | 无 | **onErrorCaptured 自动降级**到 CSS spinner |