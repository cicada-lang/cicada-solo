import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { PiValue, FnValue } from "../../exps"
import { Var, VarNeutral } from "../../exps"
import { TypeValue, NotYetValue } from "../../cores"

export class Fn extends Exp {
  name: string
  ret: Exp

  constructor(name: string, ret: Exp) {
    super()
    this.name = name
    this.ret = ret
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new FnValue(
      new Closure(ctx, env, this.name, new TypeValue(), this.ret)
    )
    // return new FnValue(
    //   new Closure(ctx, env, this.name, infer(ctx, new Var(this.name)), this.ret)
    // )
  }

  check(ctx: Ctx, t: Value): void {
    const pi = expect(ctx, t, PiValue)
    const arg = new NotYetValue(pi.arg_t, new VarNeutral(this.name))
    const ret_t = pi.ret_t_cl.apply(arg)
    check(ctx.extend(this.name, pi.arg_t), this.ret, ret_t)
  }

  repr(): string {
    return `(${this.name}) => ${this.ret.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const ret_repr = this.ret.alpha_repr(ctx.extend(this.name))
    return `(${this.name}) => ${ret_repr}`
  }
}
