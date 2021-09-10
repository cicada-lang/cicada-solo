import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Subst } from "../../subst"
import { check } from "../../exp"
import { Trace } from "../../errors"
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
    if (t instanceof Exps.PiValue) {
      const { arg_t, ret_t_cl } = t
      const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
      const arg = new Exps.NotYetValue(arg_t, new Exps.VarNeutral(fresh_name))
      const ret_t = ret_t_cl.apply(arg)
      const ret = this.ret.subst(this.name, new Exps.Var(fresh_name))
      const ret_core = check(ctx.extend(fresh_name, arg_t), ret, ret_t)
      return new Exps.FnCore(fresh_name, ret_core)
    } else if (t instanceof Exps.PiImValue) {
      const { arg_t, pi_cl } = t
      const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
      const arg = new Exps.NotYetValue(arg_t, new Exps.VarNeutral(fresh_name))
      const pi = pi_cl.apply(arg)
      const result = check(ctx.extend(fresh_name, arg_t), this, pi)
      // TODO The result of elab might also be `FnImCore`
      if (!(result instanceof Exps.FnCore)) {
        throw new Trace(
          [
            `Fn.check expecting the result of elaborating this fn to a FnCore`,
            `result of elab: ${JSON.stringify(result, null, 2)}`,
          ].join("\n")
        )
      }
      return new Exps.FnImCore(fresh_name, result)
    } else {
      throw new Trace(
        [
          `Fn.check expecting t to be PiValue or PiImValue`,
          `t: ${JSON.stringify(t, null, 2)}`,
        ].join("\n")
      )
    }
  }

  multi_fn_repr(names: Array<string> = new Array()): {
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
