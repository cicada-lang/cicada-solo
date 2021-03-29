import { Exp, AlphaCtx } from "@/exp"
import { Value } from "@/value"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { TypeValue } from "@/core"

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
    throw new Error("TODO")
    // CleValue
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    throw new Error("TODO")
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
