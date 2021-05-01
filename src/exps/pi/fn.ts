import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { check } from "../../check"
import { expect } from "../../expect"
import * as Cores from "../../cores"

export class Fn extends Exp {
  name: string
  ret: Exp

  constructor(name: string, ret: Exp) {
    super()
    this.name = name
    this.ret = ret
  }

  evaluate(ctx: Ctx, env: Env): Value {
    // const t = infer(ctx, new Var(this.name))

    // TODO the following use of `new TypeValue()` is placeholder.
    const t = new Cores.TypeValue()

    return new Cores.FnValue(new Closure(ctx, env, this.name, t, this.ret))
  }

  check(ctx: Ctx, t: Value): void {
    const pi = expect(ctx, t, Cores.PiValue)
    const arg = new Cores.NotYetValue(pi.arg_t, new Cores.VarNeutral(this.name))
    const ret_t = pi.ret_t_cl.apply(arg)
    check(ctx.extend(this.name, pi.arg_t), this.ret, ret_t)
  }

  repr(): string {
    return `(${this.name}) => ${this.ret.repr()}`
  }
}
