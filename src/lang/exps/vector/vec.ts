import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import * as Exps from "../../exps"
import { expect, Value } from "../../value"

export class Vec extends Exp {
  meta: ExpMeta
  head: Exp
  tail: Exp

  constructor(head: Exp, tail: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.head = head
    this.tail = tail
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.head.free_names(bound_names),
      ...this.tail.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Vec {
    return new Vec(
      subst(this.head, name, exp),
      subst(this.tail, name, exp),
      this.meta
    )
  }

  check(ctx: Ctx, t: Value): Core {
    const vector_t = expect(ctx, t, Exps.VectorValue)
    const elem_t = vector_t.elem_t
    const length_value = expect(ctx, vector_t.length, Exps.Add1Value)
    const prev_value = length_value.prev
    const head_core = check(ctx, this.head, elem_t)
    const tail_t = new Exps.VectorValue(elem_t, prev_value)
    const tail_core = check(ctx, this.tail, tail_t)
    return new Exps.VecCore(head_core, tail_core)
  }

  format(): string {
    return `vec(${this.head.format()}, ${this.tail.format()})`
  }
}
