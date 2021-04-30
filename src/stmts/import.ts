import { Stmt } from "../stmt"
import { Module } from "../module"

export type ImportEntry = {
  name: string
  alias?: string
}

export class Import implements Stmt {
  path: string
  entries: Array<ImportEntry>

  constructor(path: string, entries: Array<ImportEntry>) {
    this.path = path
    this.entries = entries
  }

  async execute(mod: Module): Promise<void> {
    const imported = await mod.library.load(this.path)
    for (const { name, alias } of this.entries) {
      const t = imported.ctx.lookup_type(name)
      const value = imported.env.lookup_value(name)
      if (!t || !value) {
        throw new Error(
          `I meet undefined name: ${name}, when importing from ${this.path}`
        )
      }

      mod.ctx = mod.ctx.extend(alias || name, t, value)
      mod.env = mod.env.extend(alias || name, t, value)
    }
  }
}
