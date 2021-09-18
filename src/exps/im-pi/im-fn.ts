import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Subst } from "../../subst"
import { check } from "../../exp"
import { expect } from "../../value"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class ImFn extends Exp {
  names: Array<string>
  ret: Exps.Fn

  constructor(names: Array<string>, ret: Exps.Fn) {
    super()
    this.names = names
    this.ret = ret
  }

  free_names(bound_names: Set<string>): Set<string> {
    throw new Error()

    // return new Set([
    //   ...this.ret.free_names(new Set([...bound_names, this.name])),
    // ])
  }

  subst(name: string, exp: Exp): ImFn {
    throw new Error()

    // if (name === this.name) {
    //   return this
    // } else {
    //   const free_names = exp.free_names(new Set())
    //   const fresh_name = ut.freshen_name(free_names, this.name)
    //   const ret = this.ret.subst(this.name, new Exps.Var(fresh_name))
    //   return new ImFn(fresh_name, ret.subst(name, exp))
    // }
  }

  check(ctx: Ctx, t: Value): Core {
    throw new Error()

    // const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    // const im_pi = expect(ctx, t, Exps.ImPiValue)
    // const arg = new Exps.NotYetValue(
    //   im_pi.arg_t,
    //   new Exps.VarNeutral(fresh_name)
    // )
    // const ret_t = im_pi.ret_t_cl.apply(arg)
    // const ret = this.ret.subst(this.name, new Exps.Var(fresh_name))
    // const ret_core = check(ctx.extend(fresh_name, im_pi.arg_t), ret, ret_t)

    // if (
    //   !(ret_core instanceof Exps.FnCore || ret_core instanceof Exps.ImFnCore)
    // ) {
    //   throw new Trace(
    //     [
    //       `I expect ret_core to be Exps.FnCore or Exps.ImFnCore`,
    //       `  class name: ${ret_core.constructor.name}`,
    //     ].join("\n") + "\n"
    //   )
    // }

    // return new Exps.ImFnCore(fresh_name, ret_core)
  }

  multi_fn_repr(names: Array<string> = new Array()): {
    names: Array<string>
    ret: string
  } {
    throw new Error()

    // const name = `given ${this.name}`
    // return this.ret.multi_fn_repr([...names, name])
  }

  repr(): string {
    throw new Error()

    // const { names, ret } = this.multi_fn_repr()
    // return `(${names.join(", ")}) { ${ret} }`
  }
}
