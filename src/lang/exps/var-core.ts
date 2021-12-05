import { AlphaCtx, Core } from "../core"
import { Env } from "../env"
import { ExpTrace } from "../errors"
import { Value } from "../value"

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

  format(): string {
    return this.name
  }

  alpha_format(ctx: AlphaCtx): string {
    const depth = ctx.find_depth(this.name)
    if (depth === undefined) {
      return this.name
    }
    return `#${depth}`
  }
}
