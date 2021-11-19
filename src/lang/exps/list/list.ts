import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class List extends Exp {
  meta: ExpMeta
  elem_t: Exp

  constructor(elem_t: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.elem_t = elem_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.elem_t.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new List(subst(this.elem_t, name, exp), this.meta)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.ListCore(check(ctx, this.elem_t, new Exps.TypeValue())),
    }
  }

  format(): string {
    return `List(${this.elem_t.format()})`
  }
}
