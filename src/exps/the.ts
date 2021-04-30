import { Exp, AlphaCtx } from "../exp"
import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { evaluate } from "../evaluate"
import { check } from "../check"
import { TypeValue } from "../exps"

export class The implements Exp {
  t: Exp
  exp: Exp

  constructor(t: Exp, exp: Exp) {
    this.t = t
    this.exp = exp
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return evaluate(ctx, env, this.exp)
  }

  infer(ctx: Ctx): Value {
    check(ctx, this.t, new TypeValue())
    const t_value = evaluate(ctx, ctx.to_env(), this.t)
    check(ctx, this.exp, t_value)
    return t_value
  }

  repr(): string {
    return `@the ${this.t.repr()} ${this.exp.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `@the ${this.t.alpha_repr(ctx)} ${this.exp.alpha_repr(ctx)}`
  }
}
