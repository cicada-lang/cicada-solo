import { Exp, AlphaCtx } from "@/exp"
import { Value } from "@/value"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Telescope } from "@/telescope"
import { ClsValue } from "@/core"
import { TypeValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import * as ut from "@/ut"

export class Cls implements Exp {
  fulfilled: Array<{ name: string; t: Exp; exp: Exp }>
  demanded: Array<{ name: string; t: Exp }>

  constructor(
    fulfilled: Array<{ name: string; t: Exp; exp: Exp }>,
    demanded: Array<{ name: string; t: Exp }>
  ) {
    this.fulfilled = fulfilled
    this.demanded = demanded
  }

  evaluate(env: Env): Value {
    const fulfilled: Array<{ name: string; t: Value; value: Value }> = []

    for (const { name, t, exp } of this.fulfilled) {
      const value = evaluate(env, exp)
      const t_value = evaluate(env, t)
      fulfilled.push({ name, t: t_value, value })
      env = env.extend(name, value)
    }

    return new ClsValue(fulfilled, new Telescope(env, this.demanded))
  }

  infer(ctx: Ctx): Value {
    for (const { name, t, exp } of this.fulfilled) {
      check(ctx, t, new TypeValue())
      const t_value = evaluate(ctx.to_env(), t)
      check(ctx, exp, t_value)
      ctx = ctx.extend(name, t_value)
    }

    for (const { name, t } of this.demanded) {
      check(ctx, t, new TypeValue())
      const t_value = evaluate(ctx.to_env(), t)
      ctx = ctx.extend(name, t_value)
    }

    return new TypeValue()
  }

  repr(): string {
    if (this.fulfilled.length === 0 && this.demanded.length === 0) return "{}"
    const fulfilled = this.fulfilled.map(({ name, t, exp }) => {
      return `${name}: ${t.repr()} = ${exp.repr()}`
    })
    const demanded = this.demanded.map(({ name, t }) => {
      return `${name}: ${t.repr()}`
    })
    let s = [...fulfilled, ...demanded].join("\n")
    return `[\n${ut.indent(s, "  ")}\n]`
  }

  alpha_repr(ctx: AlphaCtx): string {
    if (this.fulfilled.length === 0 && this.demanded.length === 0) return "{}"
    const parts = []
    for (const { name, t, exp } of this.fulfilled) {
      const t_repr = t.alpha_repr(ctx)
      const exp_repr = exp.alpha_repr(ctx)
      parts.push(`${name} : ${t_repr} = ${exp_repr}`)
      ctx = ctx.extend(name)
    }
    for (const { name, t } of this.demanded) {
      const t_repr = t.alpha_repr(ctx)
      parts.push(`${name} : ${t_repr}`)
      ctx = ctx.extend(name)
    }
    let s = parts.join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }
}
