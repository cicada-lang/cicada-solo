import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { expect } from "../../value"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class ImFn extends Exp {
  name: string
  ret: Exps.Fn

  constructor(name: string, ret: Exps.Fn) {
    super()
    this.name = name
    this.ret = ret
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.ret.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): ImFn {
    if (name === this.name) {
      return this
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.name)
      const ret = subst(
        this.ret,
        this.name,
        new Exps.Var(fresh_name)
      ) as Exps.Fn
      return new ImFn(fresh_name, subst(ret, name, exp) as Exps.Fn)
    }
  }

  check(ctx: Ctx, t: Value): Core {
    // NOTE We need to insert im-fn here,
    //   because the arguments can be partly given.
    // NOTE During insertion we also reorder the arguments.
    const fresh_name = ctx.freshen(this.name)
    const im_pi = expect(ctx, t, Exps.BaseImPiValue)
    const variable = new Exps.VarNeutral(fresh_name)
    const arg = new Exps.NotYetValue(im_pi.arg_t, variable)
    const ret_t = im_pi.ret_t_cl.apply(arg)
    const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
    const ret_core = check(ctx.extend(fresh_name, im_pi.arg_t), ret, ret_t)

    if (
      !(ret_core instanceof Exps.FnCore || ret_core instanceof Exps.ImFnCore)
    ) {
      throw new Trace(
        [
          `I expect ret_core to be Exps.FnCore or Exps.ImFnCore`,
          `  class name: ${ret_core.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return new Exps.ImFnCore(fresh_name, ret_core)
  }

  fn_args_repr(): Array<string> {
    return [`given ${this.name}`, ...this.ret.fn_args_repr()]
  }

  fn_ret_repr(): string {
    return this.ret.fn_ret_repr()
  }

  repr(): string {
    const args = this.fn_args_repr().join(", ")
    const ret = this.fn_ret_repr()
    return `(${args}) { ${ret} }`
  }
}
