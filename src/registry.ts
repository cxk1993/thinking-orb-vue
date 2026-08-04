import type { AnimationMode, ModeConstructor } from './engine/types'
interface RegisteredMode { name: string; instance: AnimationMode; initialized: boolean }
class ModeRegistry {
  private _modes = new Map<string, RegisteredMode>()
  private _constructors = new Map<string, ModeConstructor>()
  private _aliases = new Map<string, string>()
  register(name: string, ctor: ModeConstructor): void { this._constructors.set(name, ctor) }
  alias(alias: string, target: string): void { this._aliases.set(alias, target) }
  get(name: string): AnimationMode | undefined {
    const resolved = this._aliases.get(name) ?? name; let entry = this._modes.get(resolved)
    if (!entry) {
      const ctor = this._constructors.get(resolved); if (!ctor) return undefined
      const instance = new ctor(); entry = { name: resolved, instance, initialized: false }; this._modes.set(resolved, entry)
    }
    if (!entry.initialized) { entry.instance.init(); entry.initialized = true }
    return entry.instance
  }
  listModes(): string[] { return Array.from(this._constructors.keys()) }
  unregister(name: string): void {
    this._constructors.delete(name); this._aliases.delete(name)
    const entry = this._modes.get(name); if (entry) { entry.instance.destroy(); this._modes.delete(name) }
  }
  clear(): void { for (const [, entry] of this._modes) entry.instance.destroy(); this._modes.clear(); this._constructors.clear(); this._aliases.clear() }
}
export const modeRegistry = new ModeRegistry()