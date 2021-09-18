import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { infer } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Li extends Exp {
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

  substitute(name: string, exp: Exp): Exp {
    return new Li(
      this.head.substitute(name, exp),
      this.tail.substitute(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_head = infer(ctx, this.head)
    const list_t = new Exps.ListValue(inferred_head.t)
    const tail_core = check(ctx, this.tail, list_t)

    return {
      t: list_t,
      core: new Exps.LiCore(inferred_head.core, tail_core),
    }
  }

  repr(): string {
    return `li(${this.head.repr()}, ${this.tail.repr()})`
  }
}
