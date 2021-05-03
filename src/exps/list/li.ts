import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../check"
import { infer } from "../../infer"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Li extends Exp {
  head: Exp
  tail: Exp

  constructor(head: Exp, tail: Exp) {
    super()
    this.head = head
    this.tail = tail
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_head = infer(ctx, this.head)
    const list_t = new Cores.ListValue(inferred_head.t)
    const tail_core = check(ctx, this.tail, list_t)
    const core = new Cores.Li(inferred_head.core, tail_core)
    return { t: list_t, core }
  }

  repr(): string {
    return `li(${this.head.repr()}, ${this.tail.repr()})`
  }
}
