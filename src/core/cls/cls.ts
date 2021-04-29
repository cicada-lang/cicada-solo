import { Exp, AlphaCtx } from "../../exp"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Telescope } from "../../telescope"
import { ClsValue } from "../../core"
import { TypeValue } from "../../core"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as ut from "../../ut"

export class Cls implements Exp {
  entries: Array<{ name: string; t: Exp; exp?: Exp }>
  name?: string

  constructor(
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    opts?: { name?: string }
  ) {
    this.entries = entries
    this.name = opts?.name
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new ClsValue(new Telescope(ctx, env, this.entries), { name: this.name })
  }

  infer(ctx: Ctx): Value {
    for (const { name, t, exp } of this.entries) {
      check(ctx, t, new TypeValue())
      const t_value = evaluate(ctx, ctx.to_env(), t)
      if (exp) check(ctx, exp, t_value)
      ctx = ctx.extend(name, t_value)
    }

    return new TypeValue()
  }

  repr(): string {
    const name = this.name ? `${this.name} ` : ""

    if (this.entries.length === 0) {
      return name + "[]"
    }

    const entries = this.entries.map(({ name, t, exp }) => {
      return exp
        ? `${name}: ${t.repr()} = ${exp.repr()}`
        : `${name}: ${t.repr()}`
    })

    const s = entries.join("\n")

    return name + `[\n${ut.indent(s, "  ")}\n]`
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

    return `[\n${ut.indent(s, "  ")}\n]`
  }
}
