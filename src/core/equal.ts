import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { check } from "../check"
import * as Value from "../value"
import { TypeValue } from "../core"

export class Equal implements Exp {
  t: Exp
  from: Exp
  to: Exp

  constructor(t: Exp, from: Exp, to: Exp) {
    this.t = t
    this.from = from
    this.to = to
  }

  evaluate(env: Env): Value.Value {
    return Value.equal(
      evaluate(env, this.t),
      evaluate(env, this.from),
      evaluate(env, this.to)
    )
  }

  infer(ctx: Ctx): Value.Value {
    check(ctx, this.t, new TypeValue())
    const t_value = evaluate(ctx.to_env(), this.t)
    check(ctx, this.from, t_value)
    check(ctx, this.to, t_value)
    return new TypeValue()
  }

  repr(): string {
    return `Equal(${this.t.repr()}, ${this.from.repr()}, ${this.to.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `Equal(${this.t.alpha_repr(ctx)}, ${this.from.alpha_repr(
      ctx
    )}, ${this.to.alpha_repr(ctx)})`
  }
}
