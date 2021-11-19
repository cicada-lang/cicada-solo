import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class ImFn extends Exp {
  meta: ExpMeta
  names: Array<{ field_name: string; local_name: string }>
  ret: Exps.Fn

  constructor(
    names: Array<{ field_name: string; local_name: string }>,
    ret: Exps.Fn,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
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

      return new ImFn(names, subst(ret, name, exp) as Exps.Fn, this.meta)
    }
  }

  check(ctx: Ctx, t: Value): Core {
    // NOTE We already need to insert im-fn here,
    //   because the arguments can be partly given.
    // NOTE The insertion will reorder the arguments.

    if (!(t instanceof Exps.ImPiValue)) {
      throw new ExpTrace(
        `I can not do im-fn insertion based on: ${t.constructor.name}`
      )
    }

    return t.insert_im_fn(ctx, this.ret, this.names)
  }

  format(): string {
    const args = this.fn_args_format().join(", ")
    const ret = this.fn_ret_format()
    return `(${args}) => { ${ret} }`
  }

  fn_args_format(): Array<string> {
    const names = this.names.map(({ field_name }) => field_name).join(", ")
    return [`implicit { ${names} }`, ...this.ret.fn_formater.fn_args_format()]
  }

  fn_ret_format(): string {
    return this.ret.fn_formater.fn_ret_format()
  }
}
