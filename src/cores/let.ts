import { Core, AlphaCtx } from "../core"
import { Value } from "../value"
import { Env } from "../env"
import { Ctx } from "../ctx"
import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"

export class Let implements Core {
  name: string
  exp: Core
  ret: Core

  constructor(name: string, exp: Core, ret: Core) {
    this.name = name
    this.exp = exp
    this.ret = ret
  }

  evaluate(ctx: Ctx, env: Env): Value {
    const t = infer(ctx, this.exp)
    const value = evaluate(ctx, env, this.exp)
    return evaluate(
      ctx.extend(this.name, t, value),
      env.extend(this.name, t, value),
      this.ret
    )
  }

  infer(ctx: Ctx): Value {
    return infer(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx, ctx.to_env(), this.exp)
      ),
      this.ret
    )
  }

  check(ctx: Ctx, t: Value): void {
    check(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx, ctx.to_env(), this.exp)
      ),
      this.ret,
      t
    )
  }

  repr(): string {
    return `@let ${this.name} = ${this.exp.repr()} ${this.ret.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `@let ${this.name} = ${this.exp.alpha_repr(
      ctx
    )} ${this.ret.alpha_repr(ctx.extend(this.name))}`
  }
}
