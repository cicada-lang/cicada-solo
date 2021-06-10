import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../check"
import { expect } from "../../expect"
import * as Cores from "../../cores"
import * as ut from "../../ut"

export class Fn extends Exp {
  name: string
  ret: Exp

  constructor(name: string, ret: Exp) {
    super()
    this.name = name
    this.ret = ret
  }

  subst(name: string, exp: Exp): Exp {
    if (name === this.name) {
      return this
    } else {
      return new Fn(this.name, this.ret.subst(name, exp))
    }
  }

  check(ctx: Ctx, t: Value): Core {
    const name = this.name
    const pi = expect(ctx, t, Cores.PiValue)
    const arg = new Cores.NotYetValue(pi.arg_t, new Cores.VarNeutral(name))
    const ret_t = pi.ret_t_cl.apply(arg)
    const ret_core = check(ctx.extend(name, pi.arg_t), this.ret, ret_t)
    return new Cores.Fn(name, ret_core)
  }

  repr(): string {
    return `(${this.name}) => ${this.ret.repr()}`
  }
}
