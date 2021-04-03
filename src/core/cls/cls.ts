import { Exp, AlphaCtx } from "@/exp"
import { Value } from "@/value"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Telescope } from "@/telescope"
import { ClsValue } from "@/core"
import { TypeValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"

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

    return new ClsValue(
      fulfilled,
      new Telescope({ env, demanded: this.demanded })
    )
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
    throw new Error("TODO")
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
