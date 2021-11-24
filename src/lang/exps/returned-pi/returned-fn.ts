import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { check } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { expect } from "../../value"
import { Solution } from "../../solution"
import { ExpTrace } from "../../errors"
import * as Exps from ".."
import * as ut from "../../../ut"
import { FnFormater } from "../pi/fn-formater"

export class ReturnedFn extends Exp {
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
    return new Set(this.ret.free_names(new Set([...bound_names, this.name])))
  }

  subst(name: string, exp: Exp): ReturnedFn {
    if (this.name === name) {
      return this
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.name)
      const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
      return new ReturnedFn(fresh_name, subst(ret, name, exp), this.meta)
    }
  }

  check(ctx: Ctx, t: Value): Core {
    const { arg_t, ret_t_cl } = expect(ctx, t, Exps.ReturnedPiValue)
    const fresh_name = ctx.freshen(this.name)
    const arg = new Exps.NotYetValue(arg_t, new Exps.VarNeutral(fresh_name))
    const ret_t = ret_t_cl.apply(arg)
    const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
    const ret_core = check(ctx.extend(fresh_name, arg_t), ret, ret_t)
    return new Exps.ReturnedFnCore(fresh_name, ret_core)
  }

  fn_formater: FnFormater = new FnFormater(this, {
    decorate_name: (name) => `returned ${name}`,
  })

  format(): string {
    return this.fn_formater.format()
  }
}
