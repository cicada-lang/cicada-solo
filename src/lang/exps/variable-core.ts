import { AlphaCtx, Core } from "../core"
import { Env } from "../env"
import { ExpTrace } from "../errors"
import { Value } from "../value"

export class VariableCore extends Core {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  evaluate(env: Env): Value {
    const value = env.find_value(this.name)
    if (value === undefined) {
      throw new ExpTrace(`I meet undefined variable name: ${this.name}`)
    }

    return value
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
