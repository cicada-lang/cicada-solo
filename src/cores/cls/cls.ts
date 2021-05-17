import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Env } from "../../env"
import { Telescope } from "../../telescope"
import * as Cores from "../../cores"
import * as ut from "../../ut"

export class Cls extends Core {
  entries: Array<{ name: string; t: Core; exp?: Core }>
  name?: string

  constructor(
    entries: Array<{ name: string; t: Core; exp?: Core }>,
    opts?: { name?: string }
  ) {
    super()
    this.entries = entries
    this.name = opts?.name
  }

  evaluate(env: Env): Value {
    return new Cores.ClsValue(new Telescope(env, this.entries), {
      name: this.name,
    })
  }

  repr(): string {
    const name = this.name || ""

    if (this.entries.length === 0) {
      return `class ${name} {}`
    }

    const entries = this.entries.map(({ name, t, exp }) => {
      return exp
        ? `${name}: ${t.repr()} = ${exp.repr()}`
        : `${name}: ${t.repr()}`
    })

    const s = entries.join("\n")

    return `class ${name} {\n${ut.indent(s, "  ")}\n}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    if (this.entries.length === 0) return "[]"

    const parts = []

    for (const { name, t, exp } of this.entries) {
      const t_repr = t.alpha_repr(ctx)
      if (exp) {
        const exp_repr = exp.alpha_repr(ctx)
        parts.push(`${name} : ${t_repr} = ${exp_repr}`)
      } else {
        parts.push(`${name} : ${t_repr}`)
      }
      ctx = ctx.extend(name)
    }

    const s = parts.join("\n")

    return `class {\n${ut.indent(s, "  ")}\n}`
  }
}
