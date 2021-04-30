import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { EqualValue } from "../../cores"

export class Equal implements Core {
  t: Core
  from: Core
  to: Core

  constructor(t: Core, from: Core, to: Core) {
    this.t = t
    this.from = from
    this.to = to
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new EqualValue(
      evaluate(ctx, env, this.t),
      evaluate(ctx, env, this.from),
      evaluate(ctx, env, this.to)
    )
  }

  infer(ctx: Ctx): Value {
    check(ctx, this.t, new TypeValue())
    const t_value = evaluate(ctx, ctx.to_env(), this.t)
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
