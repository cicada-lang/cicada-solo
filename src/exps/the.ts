import { Exp, AlphaReprOpts } from "../exp"
import { Env } from "../env"
import { Ctx } from "../ctx"
import * as Value from "../value"

import { evaluate } from "../evaluate"
import { check } from "../check"

export class The implements Exp {
  kind = "The"
  t: Exp
  exp: Exp

  constructor(t: Exp, exp: Exp) {
    this.t = t
    this.exp = exp
  }

  evaluability(env: Env): Value.Value {
    return evaluate(env, this.exp)
  }

  inferability(ctx: Ctx): Value.Value {
    check(ctx, this.t, Value.type)
    const t_value = evaluate(ctx.to_env(), this.t)
    check(ctx, this.exp, t_value)
    return t_value
  }

  repr(): string {
    return `@the ${this.t.repr()} ${this.exp.repr()}`
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return `@the ${this.t.alpha_repr(opts)} ${this.exp.alpha_repr(opts)}`
  }
}
