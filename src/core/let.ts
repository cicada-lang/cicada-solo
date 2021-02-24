import { Exp, AlphaCtx } from "../exp"
import { Value } from "../value"
import { Env } from "../env"
import * as Ctx from "../ctx"
import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"

export class Let implements Exp {
  name: string
  exp: Exp
  ret: Exp

  constructor(name: string, exp: Exp, ret: Exp) {
    this.name = name
    this.exp = exp
    this.ret = ret
  }

  evaluate(env: Env): Value {
    return evaluate(env.extend(this.name, evaluate(env, this.exp)), this.ret)
  }

  infer(ctx: Ctx.Ctx): Value {
    return infer(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx.to_env(), this.exp)
      ),
      this.ret
    )
  }

  check(ctx: Ctx.Ctx, t: Value): void {
    check(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx.to_env(), this.exp)
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
