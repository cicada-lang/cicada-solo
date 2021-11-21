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

  subst(name: string, exp: Exp): ImFn {
    if (this.name === name) {
      return this
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.name)
      const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
      return new ImFn(fresh_name, subst(ret, name, exp), this.meta)
    }
  }

  check(ctx: Ctx, t: Value): Core {
    // NOTE We already need to insert im-fn here,
    //   because the arguments can be partly given.

    if (!(t instanceof Exps.ImPiValue)) {
      throw new ExpTrace(
        `I can not do im-fn insertion based on type: ${t.constructor.name}`
      )
    }

    return t.im_inserter.insert_im_fn(ctx, this.ret)
  }

  fn_formater: FnFormater = new FnFormater(this, {
    decorate_name: (name) => `implicit ${name}`,
  })

  format(): string {
    return this.fn_formater.format()
  }
}
