import { Stmt } from "../stmt"
import { Module } from "../module"
import { Trace } from "../trace"

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
        throw new Trace(
          [
            `I meet undefined name:`,
            `  ${name}`,
            `when importing from module:`,
            `  ${this.path}`,
          ].join("\n") + "\n"
        )
      }

      mod.ctx.assert_not_redefine(alias || name, t, value)
      mod.ctx = mod.ctx.extend(alias || name, t, value)
      mod.env = mod.env.extend(alias || name, value)
    }

    mod.enter(this)
  }
}
