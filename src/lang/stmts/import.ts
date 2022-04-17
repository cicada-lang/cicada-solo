import * as Errors from "../errors"
import { Mod } from "../mod"
import { Stmt, StmtMeta, StmtOutput } from "../stmt"

export type ImportEntry = { name: string; alias?: string }

export class Import extends Stmt {
  meta: StmtMeta
  path: string
  entries: Array<ImportEntry>

  constructor(path: string, entries: Array<ImportEntry>, meta: StmtMeta) {
    super()
    this.meta = meta
    this.path = path
    this.entries = entries
  }

  async execute(mod: Mod): Promise<StmtOutput | void> {
    const url = mod.resolve(this.path)
    if (url.href === mod.url.href) {
      throw new Errors.ElaborationError(
        [
          //
          `I can not do circular import.`,
          `  path: ${this.path}`,
        ].join("\n")
      )
    }

    const imported_mod = await mod.import(url)
    for (const { name, alias } of this.entries) {
      const t = imported_mod.ctx.findType(name)
      const value = imported_mod.env.findValue(name)
      if (!t || !value) {
        throw new Errors.ElaborationError(
          [
            `I meet undefined name:`,
            `  ${name}`,
            `when importing from module:`,
            `  ${this.path}`,
          ].join("\n")
        )
      }

      mod.ctx.assertNotRedefine(alias || name, t, value)
      mod.ctx = mod.ctx.extend(alias || name, t, value)
      mod.env = mod.env.extend(alias || name, value)
    }
  }

  undo(mod: Mod): void {
    for (const { name, alias } of this.entries) {
      mod.delete(alias || name)
    }
  }

  format(): string {
    const entries = this.entries
      .map(({ name, alias }) => (alias ? `${name} as ${alias}` : name))
      .join(", ")

    return `import { ${entries} } from "${this.path}"`
  }
}
