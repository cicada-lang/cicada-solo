import { Exp } from "../exp"
import { Core } from "../core"
import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { evaluate } from "../evaluate"
import { check } from "../check"
import * as Cores from "../cores"

export class The extends Exp {
  t: Exp
  exp: Exp

  constructor(t: Exp, exp: Exp) {
    super()
    this.t = t
    this.exp = exp
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    check(ctx, this.t, new Cores.TypeValue())
    const t_value = evaluate(ctx.to_env(), this.t)
    check(ctx, this.exp, t_value)
    return t_value
  }

  repr(): string {
    return `@the ${this.t.repr()} ${this.exp.repr()}`
  }
}
