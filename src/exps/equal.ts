import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import { evaluate } from "../evaluate"
import { check } from "../check"
import * as Value from "../value"

export class Equal implements Exp {
  kind = "Equal"
  t: Exp
  from: Exp
  to: Exp

  constructor(t: Exp, from: Exp, to: Exp) {
    this.t = t
    this.from = from
    this.to = to
  }

  evaluability({ env }: { env: Env }): Value.Value {
    return Value.equal(
      evaluate(env, this.t),
      evaluate(env, this.from),
      evaluate(env, this.to)
    )
  }

  inferability({ ctx }: { ctx: Ctx }): Value.Value {
    check(ctx, this.t, Value.type)
    const t_value = evaluate(ctx.to_env(), this.t)
    check(ctx, this.from, t_value)
    check(ctx, this.to, t_value)
    return Value.type
  }

  repr(): string {
    return `Equal(${this.t.repr()}, ${this.from.repr()}, ${this.to.repr()})`
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return `Equal(${this.t.alpha_repr(opts)}, ${this.from.alpha_repr(
      opts
    )}, ${this.to.alpha_repr(opts)})`
  }
}
