import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { expect } from "../../value"
import { infer } from "../../exp"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class Vec extends Exp {
  head: Exp
  tail: Exp

  constructor(head: Exp, tail: Exp) {
    super()
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
    return new Vec(this.head.subst(name, exp), this.tail.subst(name, exp))
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

  repr(): string {
    return `vec(${this.head.repr()}, ${this.tail.repr()})`
  }
}
