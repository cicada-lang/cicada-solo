import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../check"
import { Value } from "../../value"
import * as Cores from "../../cores"

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
    return new List(this.elem_t.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.TypeValue(),
      core: new Cores.List(check(ctx, this.elem_t, new Cores.TypeValue())),
    }
  }

  repr(): string {
    return `List(${this.elem_t.repr()})`
  }
}
