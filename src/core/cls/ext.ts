import { Exp, AlphaCtx } from "@/exp"
import { Value, match_value } from "@/value"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Telescope } from "@/telescope"
import { Var, ClsValue, ExtValue } from "@/core"
import { TypeValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export class Ext implements Exp {
  name?: string
  parent_name: string
  entries: Array<{ name: string; t: Exp; exp?: Exp }>

  constructor(
    parent_name: string,
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    opts?: { name?: string }
  ) {
    this.parent_name = parent_name
    this.entries = entries
    this.name = opts?.name
  }

  evaluate(env: Env): Value {
    const parent = evaluate(env, new Var(this.parent_name))
    if (parent instanceof ClsValue) {
      return new ExtValue([
        { name: parent.name, telescope: parent.telescope },
        { name: this.name, telescope: new Telescope(env, this.entries) },
      ])
    }
    if (parent instanceof ExtValue) {
      return new ExtValue([
        ...parent.entries,
        { name: this.name, telescope: new Telescope(env, this.entries) },
      ])
    }
    throw new Trace(`Expecting parent to be ClsValue or ExtValue`)
  }

  infer(ctx: Ctx): Value {
    const parent = evaluate(ctx.to_env(), new Var(this.parent_name))
    if (!(parent instanceof ClsValue || parent instanceof ExtValue)) {
      throw new Trace(`Expecting parent to be ClsValue or ExtValue`)
    }

    for (const { name, t, exp } of this.entries) {
      check(ctx, t, new TypeValue())
      const t_value = evaluate(ctx.to_env(), t)
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

    return (
      name + `@extends ${this.parent_name} ` + `[\n${ut.indent(s, "  ")}\n]`
    )
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
