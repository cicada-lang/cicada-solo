import { Exp } from "../../exp"
import { Core } from "../../core"
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

  check(ctx: Ctx, t: Value): Core {
    const pi = expect(ctx, t, Cores.PiValue)
    const arg = new Cores.NotYetValue(pi.arg_t, new Cores.VarNeutral(this.name))
    const ret_t = pi.ret_t_cl.apply(arg)
    const ret_core = check(ctx.extend(this.name, pi.arg_t), this.ret, ret_t)
    return new Cores.Fn(this.name, ret_core)
  }

  repr(): string {
    return `(${this.name}) => ${this.ret.repr()}`
  }
}
