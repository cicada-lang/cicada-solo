import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { Trace } from "../trace"

export class Var implements Exp {
  name: string

  constructor(name: string) {
    this.name = name
  }

  evaluate(env: Env): Value {
    const result = env.lookup(this.name)
    if (result === undefined) {
      throw new Trace(
        `Fail to evaluate a variable.\n` +
          `The name ${this.name} is undefined.`
      )
    }

    return result
  }

  infer(ctx: Ctx): Value {
    const t = ctx.lookup(this.name)
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
