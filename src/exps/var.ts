import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { Trace } from "../trace"

export class Var extends Exp {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  evaluate(ctx: Ctx, env: Env): Value {
    const result = env.lookup_value(this.name)
    if (result === undefined) {
      throw new Trace(
        `Fail to evaluate a variable.\n` + `The name ${this.name} is undefined.`
      )
    }

    return result
  }

  infer(ctx: Ctx): Value {
    const t = ctx.lookup_type(this.name)
    if (t === undefined) {
      throw new Trace(
        `Fail to infer the type of a variable.\n` +
          `The name ${this.name} is undefined.`
      )
    }
    return t
  }

  repr(): string {
    return this.name
  }

  alpha_repr(ctx: AlphaCtx): string {
    const depth = ctx.depths.get(this.name)
    if (depth === undefined) return this.name
    return `[${depth}]`
  }
}
