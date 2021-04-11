import { Stmt } from "../stmt"
import { Module } from "../module"
import { Exp } from "../exp"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import { The, Type, TypeValue, Cls, Ext } from "../core"

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
      // TODO handle alias
      const t = imported.ctx.lookup(name)
      const value = imported.env.lookup(name)
      if (!t || !value) {
        throw new Error(
          `I meet undefined name: ${name}, when importing from ${this.path}`
        )
      }

      mod.ctx = mod.ctx.extend(name, t)
      mod.env = mod.env.extend(name, value)
    }
  }
}
