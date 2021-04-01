import { Exp, AlphaCtx } from "@/exp"
import { Value } from "@/value"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Telescope } from "@/telescope"
import { ClsValue } from "@/core"
import { TypeValue } from "@/core"
import { evaluate } from "@/evaluate"

export class Cls implements Exp {
  fulfilled: Array<{ name: string; t: Exp; exp: Exp }>
  demanded: Array<{ name: string; t: Exp }>

  constructor(opts: {
    fulfilled: Array<{ name: string; t: Exp; exp: Exp }>
    demanded: Array<{ name: string; t: Exp }>
  }) {
    this.fulfilled = opts.fulfilled
    this.demanded = opts.demanded
  }

  evaluate(env: Env): Value {
    const fulfilled: Array<{ name: string; t: Value; value: Value }> = []

    for (const { name, t, exp } of this.fulfilled) {
      const value = evaluate(env, exp)
      fulfilled.push({ name, t: evaluate(env, t), value })
      env = env.extend(name, value)
    }

    const telescope = new Telescope({ env, demanded: this.demanded })
    return new ClsValue({ fulfilled, telescope })
  }

  infer(ctx: Ctx): Value {
    // TODO check fulfilled and demanded are well formed
    return new TypeValue()
  }

  repr(): string {
    throw new Error("TODO")
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
