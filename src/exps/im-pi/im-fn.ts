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
  names: Array<{
    field_name: string
    local_name: string
  }>
  ret: Exps.Fn

  constructor(
    names: Array<{
      field_name: string
      local_name: string
    }>,
    ret: Exps.Fn
  ) {
    super()
    this.names = names
    this.ret = ret
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set(
      this.ret.free_names(
        new Set([
          ...bound_names,
          ...this.names.map(({ local_name }) => local_name),
        ])
      )
    )
  }

  subst(name: string, exp: Exp): ImFn {
    if (this.names.some(({ local_name }) => name === local_name)) {
      return this
    } else {
      let ret = this.ret
      let names = []

      for (const { field_name, local_name } of this.names) {
        const free_names = exp.free_names(new Set())
        const fresh_name = ut.freshen(free_names, local_name)
        ret = subst(ret, local_name, new Exps.Var(fresh_name)) as Exps.Fn
        names.push({ field_name, local_name: fresh_name })
      }

      return new ImFn(names, subst(ret, name, exp) as Exps.Fn)
    }
  }

  check(ctx: Ctx, t: Value): Core {
    throw new Error("TODO")

    // // NOTE We need to insert im-fn here,
    // //   because the arguments can be partly given.
    // // NOTE During insertion we also reorder the arguments.
    // const fresh_name = ctx.freshen(this.name)
    // const im_pi = expect(ctx, t, Exps.BaseImPiValue)
    // const variable = new Exps.VarNeutral(fresh_name)
    // const arg = new Exps.NotYetValue(im_pi.arg_t, variable)
    // const ret_t = im_pi.ret_t_cl.apply(arg)
    // const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
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

  fn_args_repr(): Array<string> {
    throw new Error("TODO")
    // return [`given ${this.name}`, ...this.ret.fn_args_repr()]
  }

  fn_ret_repr(): string {
    throw new Error("TODO")
    // return this.ret.fn_ret_repr()
  }

  repr(): string {
    throw new Error("TODO")
    // const args = this.fn_args_repr().join(", ")
    // const ret = this.fn_ret_repr()
    // return `(${args}) { ${ret} }`
  }
}
