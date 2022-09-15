import { freshen } from "../../../utils/freshen"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import * as Exps from "../../exps"
import { expect, Value } from "../../value"
import { FnFormater } from "./fn-formater"

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
      const fresh_name = freshen(free_names, this.name)
      const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
      return new Fn(fresh_name, subst(ret, name, exp), this.meta)
    }
  }

  check(ctx: Ctx, t: Value): Core {
    if (t instanceof Exps.ImplicitPiValue) {
      return t.implicit_inserter.insert_implicit_fn(ctx, this)
    }

    const { arg_t, ret_t_cl } = expect(ctx, t, Exps.PiValue)
    const fresh_name = ctx.freshen(this.name)
    const arg = new Exps.NotYetValue(arg_t, new Exps.VarNeutral(fresh_name))
    const ret_t = ret_t_cl.apply(arg)
    const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
    const ret_core = check(ctx.extend(fresh_name, arg_t), ret, ret_t)
    return new Exps.FnCore(fresh_name, ret_core)
  }

  fn_formater = new FnFormater(this)

  format(): string {
    return this.fn_formater.format()
  }
}
