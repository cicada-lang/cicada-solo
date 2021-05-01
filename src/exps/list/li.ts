import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
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
    const elem_t = infer(ctx, this.head)
    check(ctx, this.tail, new Cores.ListValue(elem_t))
    return new Cores.ListValue(elem_t)
  }

  repr(): string {
    return `li(${this.head.repr()}, ${this.tail.repr()})`
  }
}
