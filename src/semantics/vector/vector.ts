import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class Vector extends Exp {
  elem_t: Exp
  length: Exp

  constructor(elem_t: Exp, length: Exp) {
    super()
    this.elem_t = elem_t
    this.length = length
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.elem_t.free_names(bound_names),
      ...this.length.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Vector(
      this.elem_t.subst(name, exp),
      this.length.subst(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Sem.TypeValue(),
      core: new Sem.Vector(
        check(ctx, this.elem_t, new Sem.TypeValue()),
        check(ctx, this.length, new Sem.NatValue())
      ),
    }
  }

  repr(): string {
    return `Vector(${this.elem_t.repr()}, ${this.length.repr()})`
  }
}
