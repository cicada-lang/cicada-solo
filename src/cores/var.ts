import { Core, AlphaCtx } from "../core"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { Trace } from "../trace"

export class Var extends Core {
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

  repr(): string {
    return this.name
  }

  alpha_repr(ctx: AlphaCtx): string {
    const depth = ctx.depths.get(this.name)
    if (depth === undefined) return this.name
    return `[${depth}]`
  }
}
