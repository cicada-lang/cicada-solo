import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../check"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Vector extends Exp {
  elem_t: Exp
  length: Exp

  constructor(elem_t: Exp, length: Exp) {
    super()
    this.elem_t = elem_t
    this.length = length
  }

  subst(name: string, exp: Exp): Exp {
    return new Vector(
      this.elem_t.subst(name, exp),
      this.length.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.TypeValue(),
      core: new Cores.Vector(
        check(ctx, this.elem_t, new Cores.TypeValue()),
        check(ctx, this.length, new Cores.NatValue())
      ),
    }
  }

  repr(): string {
    return `Vector(${this.elem_t.repr()}, ${this.length.repr()})`
  }
}
