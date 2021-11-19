import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../../ut"
import { FnFormater } from "../pi/fn-formater"

export class ImFn extends Exp {
  meta: ExpMeta
  field_name: string
  local_name: string
  ret: Exps.Fn | Exps.ImFn

  constructor(
    field_name: string,
    local_name: string,
    ret: Exps.Fn | Exps.ImFn,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
    this.field_name = field_name
    this.local_name = local_name
    this.ret = ret
  }

  get name(): string {
    return this.local_name
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set(
      this.ret.free_names(new Set([...bound_names, this.local_name]))
    )
  }

  subst(name: string, exp: Exp): ImFn {
    if (this.local_name === name) {
      return this
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.local_name)
      const ret = subst(this.ret, this.local_name, new Exps.Var(fresh_name))

      return new ImFn(
        this.field_name,
        fresh_name,
        subst(ret, name, exp) as Exps.Fn | Exps.ImFn,
        this.meta
      )
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

    return t.insert_im_fn(ctx, this.ret, {
      field_name: this.field_name,
      local_name: this.local_name,
    })
  }

  fn_formater: FnFormater = new FnFormater(this, {
    decorate_name: (name) => `implicit ${name}`,
  })

  format(): string {
    return this.fn_formater.format()
  }
}
