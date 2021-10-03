import { Stmt } from "../stmt"
import { Module } from "../module"
import { Trace } from "../errors"
import Path from "path"
import pt from "@cicada-lang/partech"

export type ImportEntry = {
  name: string
  alias?: string
}

export class Import extends Stmt {
  path: string
  entries: Array<ImportEntry>
  meta: { span: pt.Span }

  constructor(path: string, entries: Array<ImportEntry>, meta: { span: pt.Span }) {
    super()
    this.path = path
    this.entries = entries
    this.meta = meta
  }

  async execute(mod: Module): Promise<void> {
    const path = resolve_path(mod.path, this.path)
    if (path === mod.path) {
      throw new Trace(
        [`I can not do circular import.`, `  path: ${path}`].join("\n")
      )
    }

    const imported_mod = await mod.library.load(path)

    try {
      await imported_mod.run()
    } catch (error) {
      throw new Trace(
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
        throw new Trace(
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
  }

  repr(): string {
    const entries = this.entries
      .map(({ name, alias }) => (alias ? `${name} as ${alias}` : name))
      .join(", ")

    return `import { ${entries} } from "${this.path}"`
  }
}

function resolve_path(base: string, path: string): string {
  if (path.startsWith("@/")) {
    return path.slice("@/".length)
  } else if (Path.isAbsolute(base)) {
    return Path.resolve(Path.dirname(base), path)
  } else {
    return Path.resolve(Path.dirname("/" + base), path).slice(1)
  }
}
