import type { RenderResult, Projector } from './core'
export interface ModeConfig { name: string; defaults: Record<string, number> }
export interface FrameContext {
  time: number; delta: number; size: number; dark: boolean; speed: number; projector: Projector; opts: Record<string, number>
}
export interface AnimationMode {
  readonly config: ModeConfig; init(): void; update(ctx: FrameContext): RenderResult; destroy(): void
}
export type ModeConstructor = new () => AnimationMode