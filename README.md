# Thinking Orb Vue

Dotted thought-orb loading indicators for AI & agent UIs — 9 animated states, Vue 3, Canvas 2D.

· [Repository](https://github.com/cxk1993/thinking-orb-vue)

## Install

```bash
npm install thinking-orb-vue
```

## Quick start

```vue
<template>
  <ThinkingOrb state="working" :size="64" />
</template>

<script setup>
import { ThinkingOrb } from 'thinking-orb-vue'
</script>
```

## 9 states

| State | Mode | Animation |
|-------|------|-----------|
| `working` | orbits | Particles on tilted orbits |
| `searching` | globe | Scan meridian on dotted globe |
| `solving` | rubik | Band scramble → reset |
| `listening` | wave | Waveform through latitude rings |
| `connecting` | web | Constellation wiring |
| `weaving` | braid | Three-strand plait |
| `composing` | ribbon | Undulating multi-band sash |
| `breathing` | ring | Ring slowly morphing |
| `shaping` | morph | Dotted outline morphs |

## License

MIT
