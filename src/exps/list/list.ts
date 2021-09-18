import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class List extends Exp {
  elem_t: Exp

  constructor(elem_t: Exp) {
    super()
    this.elem_t = elem_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.elem_t.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new List(subst(this.elem_t, name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.ListCore(check(ctx, this.elem_t, new Exps.TypeValue())),
    }
  }

  repr(): string {
    return `List(${this.elem_t.repr()})`
  }
}
