import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { ExpTrace } from "../../errors"
import { expect } from "../../value"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class Fn extends Exp {
  meta: ExpMeta
  name: string
  ret: Exp

  constructor(name: string, ret: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
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
      const fresh_name = ut.freshen(free_names, this.name)
      const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
      return new Fn(fresh_name, subst(ret, name, exp), this.meta)
    }
  }

  check(ctx: Ctx, t: Value): Core {
    if (t instanceof Exps.ImPiValue) {
      return t.insert_im_fn(ctx, this, [])
    }

    const { arg_t, ret_t_cl } = expect(ctx, t, Exps.PiValue)
    const fresh_name = ctx.freshen(this.name)
    const arg = new Exps.NotYetValue(arg_t, new Exps.VarNeutral(fresh_name))
    const ret_t = ret_t_cl.apply(arg)
    const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
    const ret_core = check(ctx.extend(fresh_name, arg_t), ret, ret_t)
    return new Exps.FnCore(fresh_name, ret_core)
  }

  format(): string {
    const args = this.fn_args_format().join(", ")
    const ret = this.fn_ret_format()
    return `(${args}) => { ${ret} }`
  }

  fn_args_format(): Array<string> {
    if (has_fn_args_format(this.ret)) {
      return [this.name, ...this.ret.fn_args_format()]
    } else {
      return [this.name]
    }
  }

  fn_ret_format(): string {
    if (has_fn_ret_format(this.ret)) {
      return this.ret.fn_ret_format()
    } else {
      return this.ret.format()
    }
  }
}

function has_fn_args_format(
  exp: Exp
): exp is Exp & { fn_args_format(): Array<string> } {
  return (exp as any).fn_args_format instanceof Function
}

function has_fn_ret_format(exp: Exp): exp is Exp & { fn_ret_format(): string } {
  return (exp as any).fn_ret_format instanceof Function
}
