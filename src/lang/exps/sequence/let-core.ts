import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Env } from "../../env"
import { evaluate } from "../../core"

export class LetCore extends Core {
  name: string
  exp: Core
  ret: Core

  constructor(name: string, exp: Core, ret: Core) {
    super()
    this.name = name
    this.exp = exp
    this.ret = ret
  }

  evaluate(env: Env): Value {
    const value = evaluate(env, this.exp)
    return evaluate(env.extend(this.name, value), this.ret)
  }

  format(): string {
    return `${this.name} = ${this.exp.format()}; ${this.ret.format()}`
  }

  alpha_format(ctx: AlphaCtx): string {
    throw new Error(
      "We should not call LetCore.alpha_format, " +
        "because Let expressions should be removed after readback."
    )
  }
}
