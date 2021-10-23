import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Vector extends Exp {
  meta: ExpMeta
  elem_t: Exp
  length: Exp

  constructor(elem_t: Exp, length: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.elem_t = elem_t
    this.length = length
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.elem_t.free_names(bound_names),
      ...this.length.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Vector {
    return new Vector(
      subst(this.elem_t, name, exp),
      subst(this.length, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.VectorCore(
        check(ctx, this.elem_t, new Exps.TypeValue()),
        check(ctx, this.length, new Exps.NatValue())
      ),
    }
  }

  repr(): string {
    return `Vector(${this.elem_t.repr()}, ${this.length.repr()})`
  }
}
