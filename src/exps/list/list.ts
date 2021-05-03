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

  infer(ctx: Ctx): { t: Value; core: Core } {
    const core = new Cores.List(check(ctx, this.elem_t, new Cores.TypeValue()))
    const t = new Cores.TypeValue()
    return { t, core }
  }

  repr(): string {
    return `List(${this.elem_t.repr()})`
  }
}
