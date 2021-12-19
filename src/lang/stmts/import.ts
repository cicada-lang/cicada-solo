import { Module } from "../../module"
import * as Errors from "../errors"
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

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    const url = mod.resolve(this.path)
    if (url.href === mod.url.href) {
      throw new Errors.ExpTrace(
        [
          `I can not do circular import.`,
          `  path: ${this.path}`,
          `  resolved url: ${url}`,
        ].join("\n")
      )
    }

    const imported_mod = await Module.load(url, {
      observers: mod.ctx.observers,
      highlighter: mod.ctx.highlighter,
    })

    try {
      await imported_mod.runAll()
    } catch (error) {
      throw new Errors.ExpTrace(
        [
          `I fail to import from path: ${this.path}`,
          `because there are errors in that module.`,
        ].join("\n")
      )
    }

    for (const { name, alias } of this.entries) {
      const t = imported_mod.ctx.find_type(name)
      const value = imported_mod.env.find_value(name)
      if (!t || !value) {
        throw new Errors.ExpTrace(
          [
            `I meet undefined name:`,
            `  ${name}`,
            `when importing from module:`,
            `  ${this.path}`,
          ].join("\n")
        )
      }

      mod.ctx.assert_not_redefine(alias || name, t, value)
      mod.ctx = mod.ctx.extend(alias || name, t, value)
      mod.env = mod.env.extend(alias || name, value)
    }

    return undefined
  }

  format(): string {
    const entries = this.entries
      .map(({ name, alias }) => (alias ? `${name} as ${alias}` : name))
      .join(", ")

    return `import { ${entries} } from "${this.path}"`
  }
}
