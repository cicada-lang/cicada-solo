import { Exp, AlphaReprOpts } from "../exp"
import { Value } from "../value"
import { Env } from "../env"
import * as Ctx from "../ctx"

import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"
import * as ut from "../ut"

export class Let implements Exp {
  kind = "Let"
  name: string
  exp: Exp
  ret: Exp

  constructor(name: string, exp: Exp, ret: Exp) {
    this.name = name
    this.exp = exp
    this.ret = ret
  }

  evaluability(env: Env): Value {
    return evaluate(env.extend(this.name, evaluate(env, this.exp)), this.ret)
  }

  inferability({ ctx }: { ctx: Ctx.Ctx }): Value {
    return infer(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx.to_env(), this.exp)
      ),
      this.ret
    )
  }

  checkability(t: Value, { ctx }: { ctx: Ctx.Ctx }): void {
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

  alpha_repr(opts: AlphaReprOpts): string {
    return `@let ${this.name} = ${this.exp.alpha_repr(
      opts
    )} ${this.ret.alpha_repr({
      depth: opts.depth + 1,
      depths: new Map([...opts.depths, [this.name, opts.depth]]),
    })}`
  }
}
