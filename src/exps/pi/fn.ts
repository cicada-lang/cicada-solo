import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../exp"
import { expect } from "../../value"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class Fn extends Exp {
  name: string
  ret: Exp

  constructor(name: string, ret: Exp) {
    super()
    this.name = name
    this.ret = ret
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.ret.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): Fn {
    if (name === this.name) {
      return this
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.name)
      const ret = this.ret.subst(this.name, new Exps.Var(fresh_name))
      return new Fn(fresh_name, ret.subst(name, exp))
    }
  }

  check(ctx: Ctx, t: Value): Core {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    const pi = expect(ctx, t, Exps.PiValue)
    const arg = new Exps.NotYetValue(pi.arg_t, new Exps.VarNeutral(fresh_name))
    const ret_t = pi.ret_t_cl.apply(arg)
    const ret = this.ret.subst(this.name, new Exps.Var(fresh_name))
    const ret_core = check(ctx.extend(fresh_name, pi.arg_t), ret, ret_t)
    return new Exps.FnCore(fresh_name, ret_core)
  }

  private multi_fn_repr(names: Array<string> = new Array()): {
    names: Array<string>
    ret: string
  } {
    if (this.ret instanceof Fn) {
      return this.ret.multi_fn_repr([...names, this.name])
    } else {
      return { names: [...names, this.name], ret: this.ret.repr() }
    }
  }

  repr(): string {
    const { names, ret } = this.multi_fn_repr()
    return `(${names.join(", ")}) { ${ret} }`
  }
}
