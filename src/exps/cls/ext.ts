import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Ext extends Exp {
  name?: string
  super_name?: string
  parent_name: string
  entries: Array<{ name: string; t: Exp; exp?: Exp }>

  constructor(
    parent_name: string,
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    opts?: { name?: string; super_name?: string }
  ) {
    super()
    this.parent_name = parent_name
    this.entries = entries
    this.name = opts?.name
    this.super_name = opts?.super_name
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const parent = evaluate(ctx.to_env(), new Cores.Var(this.parent_name))
    if (
      !(parent instanceof Cores.ClsValue || parent instanceof Cores.ExtValue)
    ) {
      throw new Trace(`Expecting parent to be ClsValue or ExtValue`)
    }

    ctx = parent.extend_ctx(ctx)

    const core_entries: Array<{
      name: string
      t: Core
      exp?: Core
    }> = new Array()

    for (const { name, t, exp } of this.entries) {
      const t_core = check(ctx, t, new Cores.TypeValue())
      const t_value = evaluate(ctx.to_env(), t_core)
      const exp_core = exp ? check(ctx, exp, t_value) : undefined
      core_entries.push({ name, t: t_core, exp: exp_core })
      ctx = ctx.extend(name, t_value)
    }

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Ext(this.parent_name, core_entries, {
        name: this.name,
      }),
    }
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

    return (
      name + `@extends ${this.parent_name} ` + `[\n${ut.indent(s, "  ")}\n]`
    )
  }
}
