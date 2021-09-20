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
    const fresh_name = ctx.freshen(this.name)
    const im_pi = expect(ctx, t, Exps.BaseImPiValue)
    const arg = new Exps.NotYetValue(
      im_pi.arg_t,
      new Exps.VarNeutral(fresh_name)
    )
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

  flatten_repr(names: Array<string> = new Array()): {
    names: Array<string>
    ret: string
  } {
    const name = `given ${this.name}`
    return this.ret.flatten_repr([...names, name])
  }

  repr(): string {
    const { names, ret } = this.flatten_repr()
    return `(${names.join(", ")}) { ${ret} }`
  }
}
