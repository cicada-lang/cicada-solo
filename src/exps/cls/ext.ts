import { Exp } from "../../exp"
import { Value, match_value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Telescope } from "../../telescope"
import { Var } from "../../exps"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Ext extends Exp {
  name?: string
  parent_name: string
  entries: Array<{ name: string; t: Exp; exp?: Exp }>

  constructor(
    parent_name: string,
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    opts?: { name?: string }
  ) {
    super()
    this.parent_name = parent_name
    this.entries = entries
    this.name = opts?.name
  }

  evaluate(ctx: Ctx, env: Env): Value {
    const parent = evaluate(ctx, env, new Var(this.parent_name))
    if (parent instanceof Cores.ClsValue) {
      return new Cores.ExtValue([
        { name: parent.name, telescope: parent.telescope },
        { name: this.name, telescope: new Telescope(ctx, env, this.entries) },
      ])
    }
    if (parent instanceof Cores.ExtValue) {
      return new Cores.ExtValue([
        ...parent.entries,
        { name: this.name, telescope: new Telescope(ctx, env, this.entries) },
      ])
    }
    throw new Trace(`Expecting parent to be ClsValue or ExtValue`)
  }

  infer(ctx: Ctx): Value {
    const parent = evaluate(ctx, ctx.to_env(), new Var(this.parent_name))
    if (
      !(parent instanceof Cores.ClsValue || parent instanceof Cores.ExtValue)
    ) {
      throw new Trace(`Expecting parent to be ClsValue or ExtValue`)
    }

    ctx = parent.extend_ctx(ctx)

    for (const { name, t, exp } of this.entries) {
      check(ctx, t, new Cores.TypeValue())
      const t_value = evaluate(ctx, ctx.to_env(), t)
      if (exp) check(ctx, exp, t_value)
      ctx = ctx.extend(name, t_value)
    }

    return new Cores.TypeValue()
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
