import { Core, AlphaCtx } from "../core"
import { Env } from "../env"
import { Value } from "../value"
import { ExpTrace } from "../errors"

export class VarCore extends Core {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  evaluate(env: Env): Value {
    const result = env.find_value(this.name)
    if (result === undefined) {
      throw new ExpTrace(
        [
          `Fail to evaluate a variable.`,
          `The name ${this.name} is undefined.`,
        ].join("\n")
      )
    }

    return result
  }

  repr(): string {
    return this.name
  }

  alpha_repr(ctx: AlphaCtx): string {
    const depth = ctx.find_depth(this.name)
    if (depth === undefined) {
      return this.name
    }
    return `#${depth}`
  }
}
