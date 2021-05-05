import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../check"
import { expect } from "../../expect"
import { infer } from "../../infer"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Vec extends Exp {
  head: Exp
  tail: Exp

  constructor(head: Exp, tail: Exp) {
    super()
    this.head = head
    this.tail = tail
  }

  check(ctx: Ctx, t: Value): Core {
    const vector_t = expect(ctx, t, Cores.VectorValue)
    const elem_t = vector_t.elem_t
    const length_value = expect(ctx, vector_t.length, Cores.Add1Value)
    const prev_value = length_value.prev
    const head_core = check(ctx, this.head, elem_t)
    const tail_t = new Cores.VectorValue(elem_t, prev_value)
    const tail_core = check(ctx, this.tail, tail_t)
    return new Cores.Vec(head_core, tail_core)
  }

  repr(): string {
    return `vec(${this.head.repr()}, ${this.tail.repr()})`
  }
}
