import { Core, AlphaCtx } from "../core"
import { Value } from "../value"
import { Env } from "../env"
import { evaluate } from "../core"

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

  is_sequence = true

  evaluate(env: Env): Value {
    const value = evaluate(env, this.exp)
    return evaluate(env.extend(this.name, value), this.ret)
  }

  format(): string {
    return `${this.name} = ${this.exp.format()}; ${this.ret.format()}`
  }

  alpha_format(ctx: AlphaCtx): string {
    const exp_format = this.exp.alpha_format(ctx)
    const ret_format = this.ret.alpha_format(ctx.extend(this.name))
    return `${this.name} = ${exp_format}; ${ret_format}`
  }
}
